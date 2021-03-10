import { App, Inject, Logger, Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { TaskInfoEntity } from '../entity/info';
import { TaskLogEntity } from '../entity/log';
import { IQueue } from 'midwayjs-cool-queue';
import { ILogger } from '@midwayjs/logger';
import { IMidwayWebApplication } from '@midwayjs/web';
import * as _ from 'lodash';
import { Utils } from '../../../comm/utils';

/**
 * 任务
 */
@Provide()
export class TaskInfoService extends BaseService {
  @InjectEntityModel(TaskInfoEntity)
  taskInfoEntity: Repository<TaskInfoEntity>;

  @Logger()
  logger: ILogger;

  @InjectEntityModel(TaskLogEntity)
  taskLogEntity: Repository<TaskLogEntity>;

  @Inject()
  taskInfoQueue: IQueue;

  @App()
  app: IMidwayWebApplication;

  @Inject()
  utils: Utils;

  /**
   * 停止任务
   * @param id
   */
  async stop(id) {
    const task = await this.taskInfoEntity.findOne({ id });
    if (task) {
      const job = await this.exist(task.id);
      if (job) {
        await this.taskInfoQueue.queue.removeRepeatable(
          JSON.parse(task.repeatConf)
        );
      }
      task.status = 0;
      await this.taskInfoEntity.update(task.id, task);
      await this.updateNextRunTime(task.id);
    }
  }

  /**
   * 开始任务
   * @param id
   * @param type
   */
  async start(id, type?) {
    const task = await this.taskInfoEntity.findOne({ id });
    task.status = 1;
    if (type) {
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
      await this.taskInfoQueue.queue.add(task, {
        jobId: task.id,
        removeOnComplete: true,
        removeOnFail: true,
      });
    }
  }

  /**
   * 检查任务是否存在
   * @param jobId
   */
  async exist(jobId) {
    console.log(jobId);
    const result = await this.taskInfoQueue.queue.getRepeatableJobs();
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
          await this.taskInfoQueue.queue.removeRepeatable(
            JSON.parse(params.repeatConf)
          );
        }
        const jobOp = Object.assign(params);
        await this.utils.removeEmptyP(jobOp);
        delete jobOp.repeatConf;
        const { opts } = await this.taskInfoQueue.queue.add(params, {
          jobId: params.id,
          removeOnComplete: true,
          removeOnFail: true,
          repeat: jobOp,
        });
        if (!opts) {
          throw new Error('任务添加失败，可能由于格式不正确~');
        }
        // await transactionalEntityManager.update(TaskInfoEntity, params.id, {
        //   jobId: opts.jobId,
        // });
        repeatConf = opts;
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
        await this.taskInfoQueue.queue.removeRepeatable(
          JSON.parse(task.repeatConf)
        );
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
  }

  /**
   * 任务ID
   * @param jobId
   */
  async getNextRunTime(jobId) {
    let nextRunTime;
    const result = await this.taskInfoQueue.queue.getRepeatableJobs();
    for (const task of result) {
      if (task.id === jobId.toString()) {
        nextRunTime = new Date(task.next);
        break;
      }
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
   * 刷新任务状态
   */
  async updateStatus() {
    const result = await this.taskInfoQueue.queue.getRepeatableJobs();
    for (const job of result) {
      const task = await this.taskInfoEntity.findOne({ id: job.id });
      if (task) {
        setTimeout(async () => {
          // 2秒后清空任务
          const nextTime = await this.getNextRunTime(task.id);
          if (nextTime && nextTime.getTime() <= new Date().getTime() - 999) {
            this.nativeQuery(
              'update task_info a set a.status = ?, a.updateTime = ? where a.id = ?',
              [0, new Date(), task.id]
            );
            this.taskInfoQueue.queue.removeRepeatable(
              JSON.parse(task.repeatConf)
            );
          }
        }, 2000);
      }
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
