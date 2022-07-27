import {
  App,
  Inject,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { TaskInfoEntity } from '../entity/info';
import { TaskLogEntity } from '../entity/log';
import { ILogger } from '@midwayjs/logger';
import * as _ from 'lodash';
import { Utils } from '../../../comm/utils';
import { TaskInfoQueue } from '../queue/task';
import { IMidwayApplication } from '@midwayjs/core';

/**
 * 任务
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class TaskInfoService extends BaseService {
  @InjectEntityModel(TaskInfoEntity)
  taskInfoEntity: Repository<TaskInfoEntity>;

  @Logger()
  logger: ILogger;

  @InjectEntityModel(TaskLogEntity)
  taskLogEntity: Repository<TaskLogEntity>;

  @Inject()
  taskInfoQueue: TaskInfoQueue;

  @App()
  app: IMidwayApplication;

  @Inject()
  utils: Utils;

  /**
   * 停止任务
   * @param id
   */
  async stop(id) {
    const task = await this.taskInfoEntity.findOne({ id });
    if (task) {
      const result = await this.taskInfoQueue.getRepeatableJobs();
      const job = _.find(result, { id: task.id + '' });
      if (job) {
        await this.taskInfoQueue.removeRepeatableByKey(job.key);
      }
      task.status = 0;
      await this.taskInfoEntity.update(task.id, task);
      await this.updateNextRunTime(task.id);
    }
  }

  /**
   * 移除任务
   * @param taskId
   */
  async remove(taskId) {
    const result = await this.taskInfoQueue.getRepeatableJobs();
    const job = _.find(result, { id: taskId + '' });
    await this.taskInfoQueue.removeRepeatableByKey(job.key);
  }

  /**
   * 开始任务
   * @param id
   * @param type
   */
  async start(id, type?) {
    const task = await this.taskInfoEntity.findOne({ id });
    task.status = 1;
    if (type || type == 0) {
      task.type = type;
    }
    await this.addOrUpdate(task);
  }

  /**
   * 手动执行一次
   * @param id
   */
  async once(id) {
    const task = await this.taskInfoEntity.findOne({ id });
    if (task) {
      await this.taskInfoQueue.add(
        {
          ...task,
          isOnce: true,
        },
        {
          jobId: task.id.toString(),
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
    }
  }

  /**
   * 检查任务是否存在
   * @param jobId
   */
  async exist(jobId) {
    const result = await this.taskInfoQueue.getRepeatableJobs();
    const ids = result.map(e => {
      return e.id;
    });
    return ids.includes(jobId.toString());
  }

  /**
   * 新增或修改
   * @param params
   */
  async addOrUpdate(params) {
    delete params.repeatCount;
    let repeatConf;
    await this.getOrmManager().transaction(async transactionalEntityManager => {
      if (params.taskType === 0) {
        params.limit = null;
        params.every = null;
      } else {
        params.cron = null;
      }
      await transactionalEntityManager.save(TaskInfoEntity, params);

      if (params.status === 1) {
        const exist = await this.exist(params.id);
        if (exist) {
          await this.remove(params.id);
        }
        const { every, limit, startDate, endDate, cron } = params;
        const repeat = {
          every,
          limit,
          jobId: params.id,
          startDate,
          endDate,
          cron,
        };
        await this.utils.removeEmptyP(repeat);
        const result = await this.taskInfoQueue.add(params, {
          jobId: params.id,
          removeOnComplete: true,
          removeOnFail: true,
          repeat,
        });
        if (!result) {
          throw new Error('任务添加失败，请检查任务配置');
        }
        // await transactionalEntityManager.update(TaskInfoEntity, params.id, {
        //   jobId: params.id,
        //   type: params.type,
        // });
        repeatConf = result.opts;
      }
    });
    if (params.status === 1) {
      this.utils.sleep(1000);
      await this.updateNextRunTime(params.id);
      await this.nativeQuery(
        'update task_info a set a.repeatConf = ? where a.id = ?',
        [JSON.stringify(repeatConf.repeat), params.id]
      );
    }
  }

  /**
   * 删除
   * @param ids
   */
  async delete(ids) {
    let idArr;
    if (ids instanceof Array) {
      idArr = ids;
    } else {
      idArr = ids.split(',');
    }
    for (const id of idArr) {
      const task = await this.taskInfoEntity.findOne({ id });
      const exist = await this.exist(task.id);
      if (exist) {
        this.stop(task.id);
      }
      await this.taskInfoEntity.delete({ id });
      await this.taskLogEntity.delete({ taskId: id });
    }
  }

  /**
   * 任务日志
   * @param query
   */
  async log(query) {
    const { id, status } = query;
    return await this.sqlRenderPage(
      `
      SELECT
          a.*,
          b.NAME AS taskName
      FROM
      task_log a
      JOIN task_info b ON a.taskId = b.id
      where 1=1
      ${this.setSql(id, 'and a.taskId = ?', [id])}
      ${this.setSql(status, 'and a.status = ?', [status])}
      `,
      query
    );
  }

  /**
   * 保存任务记录，成功任务每个任务保留最新20条日志，失败日志不会删除
   * @param task
   * @param status
   * @param detail
   */
  async record(task, status, detail?) {
    await this.taskLogEntity.save({
      taskId: task.id,
      status,
      detail: detail || '',
    });
    await this.nativeQuery(
      `DELETE a
      FROM
      task_log a,
          ( SELECT id FROM task_log where taskId = ? AND status = 1 ORDER BY id DESC LIMIT ?, 1 ) b
      WHERE
      a.taskId = ? AND
      a.status = 1 AND
      a.id < b.id`,
      [task.id, 19, task.id]
    ); // 日志保留最新的20条
  }

  /**
   * 初始化任务
   */
  async initTask() {
    setTimeout(async () => {
      const runningTasks = await this.taskInfoEntity.find({ status: 1 });
      if (!_.isEmpty(runningTasks)) {
        for (const task of runningTasks) {
          const job = await this.exist(task.id); // 任务已存在就不添加
          if (!job) {
            this.logger.info(`init task ${task.name}`);
            await this.addOrUpdate(task);
          }
        }
      }
    }, 3000);
  }

  /**
   * 任务ID
   * @param jobId
   */
  async getNextRunTime(jobId) {
    let nextRunTime;
    const result = await this.taskInfoQueue.getRepeatableJobs();
    const task = _.find(result, { id: jobId + '' });
    if (task) {
      nextRunTime = new Date(task.next);
    }
    return nextRunTime;
  }

  /**
   * 更新下次执行时间
   * @param jobId
   */
  async updateNextRunTime(jobId) {
    await this.nativeQuery(
      'update task_info a set a.nextRunTime = ? where a.id = ?',
      [await this.getNextRunTime(jobId), jobId]
    );
  }

  /**
   * 详情
   * @param id
   * @returns
   */
  async info(id: any): Promise<any> {
    const info = await this.taskInfoEntity.findOne({ id });
    return {
      ...info,
      repeatCount: info.limit,
    };
  }

  /**
   * 刷新任务状态
   */
  async updateStatus(jobId) {
    const result = await this.taskInfoQueue.getRepeatableJobs();
    const job = _.find(result, { id: jobId + '' });
    if (!job) {
      return;
    }
    // @ts-ignore
    const task = await this.taskInfoEntity.findOne({ id: job.id });
    const nextTime = await this.getNextRunTime(task.id);
    if (task) {
      //   if (task.nextRunTime.getTime() == nextTime.getTime()) {
      //     task.status = 0;
      //     task.nextRunTime = nextTime;
      //     this.taskInfoQueue.removeRepeatableByKey(job.key);
      //   } else {
      task.nextRunTime = nextTime;
      //   }
      await this.taskInfoEntity.update(task.id, task);
    }
  }

  /**
   * 调用service
   * @param serviceStr
   */
  async invokeService(serviceStr) {
    if (serviceStr) {
      const arr = serviceStr.split('.');
      const service = await this.app.getApplicationContext().getAsync(arr[0]);
      for (const child of arr) {
        if (child.includes('(')) {
          const lastArr = child.split('(');
          const param = lastArr[1].replace(')', '');
          if (!param) {
            return service[lastArr[0]]();
          } else {
            return service[lastArr[0]](JSON.parse(param));
          }
        }
      }
    }
  }
}
