import {
  App,
  Config,
  Inject,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { TaskInfoEntity } from '../entity/info';
import { TaskLogEntity } from '../entity/log';
import { ILogger } from '@midwayjs/logger';
import * as _ from 'lodash';
import { Utils } from '../../../comm/utils';
import { TaskInfoQueue } from '../queue/task';
import { IMidwayApplication } from '@midwayjs/core';
import * as moment from 'moment';

/**
 * 任务
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class TaskBullService extends BaseService {
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

  @Config('module.task.log.keepDays')
  keepDays: number;

  /**
   * 停止任务
   * @param id
   */
  async stop(id) {
    const task = await this.taskInfoEntity.findOneBy({ id: Equal(id) });
    if (task) {
      const result = await this.taskInfoQueue.getJobSchedulers();
      const job = _.find(result, e => {
        return e.key == task.jobId;
      });
      if (job) {
        await this.taskInfoQueue.removeJobScheduler(job.key);
      }
      task.status = 0;
      await this.taskInfoEntity.update(task.id, task);
      await this.updateNextRunTime(task.jobId);
    }
  }
  /**
   * 移除任务
   * @param taskId
   */
  async remove(taskId) {
    const info = await this.taskInfoEntity.findOneBy({ id: Equal(taskId) });
    const result = await this.taskInfoQueue.getJobSchedulers();
    const job = _.find(result, { key: info?.jobId });
    if (job) {
      await this.taskInfoQueue.removeJobScheduler(job.key);
    }
  }
  /**
   * 开始任务
   * @param id
   * @param type
   */
  async start(id, type?) {
    const task = await this.taskInfoEntity.findOneBy({ id: Equal(id) });
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
    const task = await this.taskInfoEntity.findOneBy({ id: Equal(id) });
    if (task) {
      await this.taskInfoQueue.add(
        {
          ...task,
          isOnce: true,
        },
        {
          jobId: task.jobId,
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
    const info = await this.taskInfoEntity.findOneBy({ jobId: Equal(jobId) });
    if (!info) {
      return false;
    }
    const result = await this.taskInfoQueue.getJobSchedulers();
    const job = _.find(result, e => {
      return e.key == info.jobId;
    });
    return !!job;
  }
  /**
   * 新增或修改
   * @param params
   */
  async addOrUpdate(params) {
    delete params.repeatCount;
    let repeatConf, jobId;
    await this.getOrmManager().transaction(async transactionalEntityManager => {
      if (params.taskType === 0) {
        params.limit = null;
        params.every = null;
      } else {
        params.cron = null;
      }
      await transactionalEntityManager.save(TaskInfoEntity, params);
      if (params.status === 1) {
        const exist = await this.exist(params.jobId);
        if (exist) {
          await this.remove(params.id);
        }
        const { every, limit, startDate, endDate, cron } = params;
        const repeat = {
          every,
          limit,
          jobId: params.jobId,
          startDate,
          endDate,
          cron,
        };
        await this.utils.removeEmptyP(repeat);
        const result = await this.taskInfoQueue.add(params, {
          jobId: params.jobId,
          removeOnComplete: true,
          removeOnFail: true,
          repeat,
        });
        if (!result?.repeatJobKey) {
          throw new Error('任务添加失败，请检查任务配置');
        }
        jobId = result.repeatJobKey;
        repeatConf = result.opts;
      }
    });
    if (params.status === 1) {
      await this.updateNextRunTime(params.jobId);
      await this.taskInfoEntity.update(params.id, {
        repeatConf: JSON.stringify(repeatConf.repeat),
        status: 1,
        jobId,
      });
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
      const task = await this.taskInfoEntity.findOneBy({ id });
      const exist = await this.exist(task.jobId);
      if (exist) {
        this.stop(task.id);
      }
      await this.taskInfoEntity.delete({ id });
      await this.taskLogEntity.delete({ taskId: id });
    }
  }

  /**
   * 保存任务记录，成功任务每个任务保留最新20条日志，失败日志不会删除
   * @param task
   * @param status
   * @param detail
   */
  async record(task, status, detail?) {
    const info = await this.taskInfoEntity.findOneBy({
      id: Equal(task.id),
    });
    if (!info) {
      return;
    }
    await this.taskLogEntity.save({
      taskId: info.id,
      status,
      detail: detail || '',
    });
    // 删除时间超过20天的日志
    await this.taskLogEntity.delete({
      taskId: info.id,
      createTime: LessThan(moment().subtract(this.keepDays, 'days').toDate()),
    });
  }
  /**
   * 初始化任务
   */
  async initTask() {
    try {
      await this.utils.sleep(3000);
      this.logger.info('init task....');
      const runningTasks = await this.taskInfoEntity.findBy({ status: 1 });
      if (!_.isEmpty(runningTasks)) {
        for (const task of runningTasks) {
          const job = await this.exist(task.jobId); // 任务已存在就不添加
          if (!job) {
            this.logger.info(`init task ${task.name}`);
            await this.addOrUpdate(task);
          }
        }
      }
    } catch (e) {}
  }
  /**
   * 任务ID
   * @param jobId
   */
  async getNextRunTime(jobId) {
    let nextRunTime;
    const result = await this.taskInfoQueue.getJobSchedulers();
    const task = _.find(result, e => {
      return e.key === jobId;
    });
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
    const nextRunTime = await this.getNextRunTime(jobId);
    if (!nextRunTime) {
      return;
    }
    await this.taskInfoEntity.update(
      { jobId },
      {
        nextRunTime,
      }
    );
  }
  /**
   * 详情
   * @param id
   * @returns
   */
  async info(id: any): Promise<any> {
    const info = await this.taskInfoEntity.findOneBy({ id });
    return {
      ...info,
      repeatCount: info.limit,
    };
  }
  /**
   * 刷新任务状态
   */
  async updateStatus(jobId: number) {
    const task = await this.taskInfoEntity.findOneBy({ id: jobId });
    if (!task) {
      return;
    }
    const result = await this.taskInfoQueue.getJobSchedulers();
    const job = _.find(result, { key: task.jobId });
    if (!job) {
      return;
    }
    const nextTime = await this.getNextRunTime(task.jobId);
    if (task) {
      task.nextRunTime = nextTime;
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
      const service = await this.app
        .getApplicationContext()
        .getAsync(_.lowerFirst(arr[0]));
      for (let i = 1; i < arr.length; i++) {
        const child = arr[i];
        if (child.includes('(')) {
          const [methodName, paramsStr] = child.split('(');
          const params = paramsStr
            .replace(')', '')
            .split(',')
            .map(param => param.trim());
          if (params.length === 1 && params[0] === '') {
            return service[methodName]();
          } else {
            const parsedParams = params.map(param => {
              try {
                return JSON.parse(param);
              } catch (e) {
                return param; // 如果不是有效的JSON,则返回原始字符串
              }
            });
            return service[methodName](...parsedParams);
          }
        }
      }
    }
  }
}
