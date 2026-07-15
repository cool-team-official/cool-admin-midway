/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import {
  App,
  Config,
  IMidwayApplication,
  Init,
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

  @Config('task.execution.timeout')
  executionTimeout = 300000; // 默认5分钟超时

  @Config('task.healthCheckInterval')
  healthCheckInterval = 300000; // 默认5分钟检查一次

  @Inject()
  coolEventManager: CoolEventManager;

  // 存储所有运行的任务
  private cronJobs: Map<string, CronJob.CronJob> = new Map();
  private healthCheckTimer: NodeJS.Timeout;

  @Init()
  async initHealthCheck() {
    // 确保定时器被清理
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    // 启动健康检查定时器，使用配置的间隔时间
    this.healthCheckTimer = setInterval(() => {
      this.checkStuckTasks();
    }, this.healthCheckInterval);

    // 初始化完成后启动健康检查，但不立即执行
    // 健康检查由定时器定期执行
  }

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
   * 重建定时任务
   */
  async restartCronJob(task) {
    const job = this.cronJobs.get(task.jobId);
    if (job) {
      job.stop();
      this.cronJobs.delete(task.jobId);
      this.coolEventManager.emit('onLocalTaskStop', task.jobId);
    }
    this.createCronJob(task);
  }

  /**
   * 新增或修改
   */
  async addOrUpdate(params) {
    if (!params.jobId) {
      params.jobId = uuidv4();
    }

    const shouldStartJob = params.status === 1;

    // 使用直接保存方式，避免事务复杂性
    if (params.taskType === 0) {
      params.limit = null;
      params.every = null;
    } else {
      params.cron = null;
    }

    await this.taskInfoEntity.save(params);

    if (shouldStartJob) {
      await this.restartCronJob(params);
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

    let timeoutId: NodeJS.Timeout;
    try {
      const currentTime = moment().toDate();
      // 使用配置的超时时间而不是固定的5分钟
      const lockExpireTime = moment()
        .add(this.executionTimeout / 1000, 'seconds')
        .toDate();
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

      // 设置执行超时控制
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`任务执行超时 (${this.executionTimeout}ms)`));
        }, this.executionTimeout);
      });

      // 执行实际任务并处理超时
      const serviceResult = await Promise.race([
        this.invokeService(task.service),
        timeoutPromise,
      ]);

      await this.record(task, 1, JSON.stringify(serviceResult));
    } catch (error) {
      await this.record(task, 0, error.message);
    } finally {
      // 清除超时定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // 确保锁被释放
      try {
        await this.taskInfoEntity.update(
          { id: task.id },
          { lockExpireTime: null }
        );
      } catch (releaseError) {
        this.logger.error('释放任务锁失败:', releaseError);
      }
    }

    if (!task.isOnce) {
      await this.updateNextRunTime(task.jobId);
      await this.taskInfoEntity.update({ id: task.id }, { status: 1 });
    }
  }

  /**
   * 检查卡住的任务并清理过期锁
   */
  async checkStuckTasks() {
    try {
      this.logger.debug('开始检查本地任务的卡住任务...');

      const now = moment().toDate();
      const expiredLocks = await this.taskInfoEntity.find({
        where: {
          lockExpireTime: LessThan(now),
        },
      });

      if (expiredLocks.length > 0) {
        this.logger.warn(
          `发现 ${expiredLocks.length} 个过期的本地任务锁，正在清理并重新执行...`
        );

        for (const task of expiredLocks) {
          this.logger.warn(`清理过期本地任务锁: ${task.name} (ID: ${task.id})`);

          // 清理锁
          await this.taskInfoEntity.update(
            { id: task.id },
            { lockExpireTime: null }
          );

          // 如果任务是启用状态，尝试重新执行
          if (task.status === 1) {
            this.logger.info(`重新执行卡住的本地任务: ${task.name}`);
            try {
              await this.executeJob(task);
              this.logger.info(`卡住任务重新执行成功: ${task.name}`);
            } catch (error) {
              this.logger.error(
                `卡住任务重新执行失败: ${task.name}, 错误:`,
                error
              );
            }
          }
        }
      } else {
        this.logger.debug('未发现过期的本地任务锁');
      }
    } catch (error) {
      this.logger.error('检查本地卡住的任务时发生错误:', error);
    }
  }

  /**
   * 销毁时清理资源
   */
  destroy() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    // 停止所有cron任务
    for (const [jobId, job] of this.cronJobs) {
      job.stop();
      this.cronJobs.delete(jobId);
    }
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
}
