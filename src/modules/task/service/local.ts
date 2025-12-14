import {
  App,
  Config,
  Inject,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { BaseService, CoolEventManager } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';
import { TaskInfoEntity } from '../entity/info';
import { TaskLogEntity } from '../entity/log';
import { ILogger } from '@midwayjs/logger';
import * as _ from 'lodash';
import { Utils } from '../../../comm/utils';
import { IMidwayApplication } from '@midwayjs/core';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import * as CronJob from 'cron';

/**
 * 本地任务
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class TaskLocalService extends BaseService {
  @InjectEntityModel(TaskInfoEntity)
  taskInfoEntity: Repository<TaskInfoEntity>;

  @Logger()
  logger: ILogger;

  @InjectEntityModel(TaskLogEntity)
  taskLogEntity: Repository<TaskLogEntity>;

  @App()
  app: IMidwayApplication;

  @Inject()
  utils: Utils;

  @Config('task.log.keepDays')
  keepDays: number;

  @Inject()
  coolEventManager: CoolEventManager;

  // 存储所有运行的任务
  private cronJobs: Map<string, CronJob.CronJob> = new Map();

  /**
   * 停止任务
   */
  async stop(id) {
    const task = await this.taskInfoEntity.findOneBy({ id: Equal(id) });
    if (task) {
      this.stopByJobId(task.jobId);
      this.coolEventManager.emit('onLocalTaskStop', task.jobId);
      task.status = 0;
      await this.taskInfoEntity.update(task.id, task);
      await this.updateNextRunTime(task.jobId);
    }
  }

  /**
   * 停止任务
   * @param jobId
   */
  async stopByJobId(jobId) {
    const job = this.cronJobs.get(jobId);
    if (job) {
      job.stop();
      this.cronJobs.delete(jobId);
    }
  }

  /**
   * 开始任务
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
   */
  async once(id) {
    const task = await this.taskInfoEntity.findOneBy({ id: Equal(id) });
    if (task) {
      await this.executeJob(task);
    }
  }

  /**
   * 检查任务是否存在
   */
  async exist(jobId) {
    return this.cronJobs.has(jobId);
  }

  /**
   * 创建定时任务
   */
  private createCronJob(task) {
    let cronTime;
    if (task.taskType === 0) {
      // cron 类型
      cronTime = task.cron;
    } else {
      // 间隔类型
      cronTime = `*/${task.every / 1000} * * * * *`;
    }

    const job = new CronJob.CronJob(
      cronTime,
      async () => {
        await this.executeJob(task);
      },
      null,
      false,
      'Asia/Shanghai'
    );

    this.cronJobs.set(task.jobId, job);
    job.start();
    return job;
  }

  /**
   * 执行任务
   */
  private async executeJob(task) {
    await this.executor(task);
  }

  /**
   * 新增或修改
   */
  async addOrUpdate(params) {
    if (!params.jobId) {
      params.jobId = uuidv4();
    }

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
          const job = this.cronJobs.get(params.jobId);
          job.stop();
          this.cronJobs.delete(params.jobId);
          this.coolEventManager.emit('onLocalTaskStop', params.jobId);
        }
        this.createCronJob(params);
      }
    });

    if (params.status === 1) {
      await this.updateNextRunTime(params.jobId);
    }
  }

  /**
   * 删除任务
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
      if (task) {
        const job = this.cronJobs.get(task.jobId);
        if (job) {
          job.stop();
          this.cronJobs.delete(task.jobId);
        }
        await this.taskInfoEntity.delete({ id });
        await this.taskLogEntity.delete({ taskId: id });
      }
    }
  }

  /**
   * 记录任务执行情况
   */
  async record(task, status, detail?) {
    const info = await this.taskInfoEntity.findOneBy({
      jobId: Equal(task.jobId),
    });
    await this.taskLogEntity.save({
      taskId: info.id,
      status,
      detail: detail || '',
    });
    await this.taskLogEntity.delete({
      taskId: info.id,
      createTime: LessThan(moment().subtract(this.keepDays, 'days').toDate()),
    });
  }

  /**
   * 获取下次执行时间
   */
  async getNextRunTime(jobId) {
    const job = this.cronJobs.get(jobId);
    return job ? job.nextDate().toJSDate() : null;
  }

  /**
   * 更新下次执行时间
   */
  async updateNextRunTime(jobId) {
    const nextRunTime = await this.getNextRunTime(jobId);
    if (nextRunTime) {
      await this.taskInfoEntity.update({ jobId }, { nextRunTime });
    }
  }

  /**
   * 初始化任务
   */
  async initTask() {
    try {
      this.logger.info('init local task....');
      const runningTasks = await this.taskInfoEntity.findBy({ status: 1 });
      if (!_.isEmpty(runningTasks)) {
        for (const task of runningTasks) {
          const job = await this.exist(task.jobId);
          if (!job) {
            this.logger.info(`init local task ${task.name}`);
            await this.addOrUpdate(task);
          }
        }
      }
    } catch (e) {
      this.logger.error('Init local task error:', e);
    }
  }

  /**
   * 调用service
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
                return param;
              }
            });
            return service[methodName](...parsedParams);
          }
        }
      }
    }
  }

  /**
   * 获取任务详情
   */
  async info(id: any): Promise<any> {
    const info = await this.taskInfoEntity.findOneBy({ id });
    return {
      ...info,
      repeatCount: info.limit,
    };
  }

  /**
   * 执行器
   */
  async executor(task: any): Promise<void> {
    // 如果不是开始时间之后的 则不执行
    if (task.startDate && moment(task.startDate).isAfter(moment())) {
      return;
    }
    try {
      const currentTime = moment().toDate();
      const lockExpireTime = moment().add(5, 'minutes').toDate();
      const result = await this.taskInfoEntity
        .createQueryBuilder()
        .update()
        .set({
          lastExecuteTime: currentTime,
          lockExpireTime: lockExpireTime,
        })
        .where('id = :id', { id: task.id })
        .andWhere('lockExpireTime IS NULL OR lockExpireTime < :currentTime', {
          currentTime,
        })
        .execute();

      // 如果更新失败（affected === 0），说明其他实例正在执行
      if (result.affected === 0) {
        return;
      }

      const serviceResult = await this.invokeService(task.service);
      await this.record(task, 1, JSON.stringify(serviceResult));
    } catch (error) {
      await this.record(task, 0, error.message);
    } finally {
      // 释放锁
      await this.taskInfoEntity.update(
        { id: task.id },
        { lockExpireTime: null }
      );
    }

    if (!task.isOnce) {
      await this.updateNextRunTime(task.jobId);
      // 修复执行一次任务后，强制回到“运行”状态的问题，即保持之前的状态。
      // await this.taskInfoEntity.update({ id: task.id }, { status: 1 });
      if (task.status) await this.taskInfoEntity.update({ id: task.id }, { status: 1 });
    }
  }
}
