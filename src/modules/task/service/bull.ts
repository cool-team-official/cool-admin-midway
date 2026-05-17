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

import {App, Config, IMidwayApplication, Init, Inject, Logger, Provide, Scope, ScopeEnum,} from '@midwayjs/core';
import {BaseService} from '@cool-midway/core';
import {InjectEntityModel} from '@midwayjs/typeorm';
import {Equal, LessThan, Repository} from 'typeorm';
import {TaskInfoEntity} from '../entity/info';
import {TaskLogEntity} from '../entity/log';
import {ILogger} from '@midwayjs/logger';
import * as _ from 'lodash';
import {Utils} from '../../../comm/utils';
import {TaskInfoQueue} from '../queue/task';
import * as moment from 'moment';

/**
 * 任务
 */
@Provide()
@Scope(ScopeEnum.Request, {allowDowngrade: true})
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

  @Config('task.log.keepDays')
  keepDays: number;

  @Config('task.execution.timeout')
  executionTimeout: number = 300000; // 默认5分钟超时

  @Config('task.healthCheckInterval')
  healthCheckInterval: number = 300000; // 默认5分钟检查一次

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
  }

  /**
   * 停止任务
   * @param id
   */
  async stop(id) {
    const task = await this.taskInfoEntity.findOneBy({id: Equal(id)});
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
    const info = await this.taskInfoEntity.findOneBy({id: Equal(taskId)});
    const result = await this.taskInfoQueue.getJobSchedulers();
    const job = _.find(result, {key: info?.jobId});
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
    const task = await this.taskInfoEntity.findOneBy({id: Equal(id)});
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
    const task = await this.taskInfoEntity.findOneBy({id: Equal(id)});
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
    const info = await this.taskInfoEntity.findOneBy({jobId: Equal(jobId)});
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
        const {every, limit, startDate, endDate, cron} = params;
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
      const task = await this.taskInfoEntity.findOneBy({id});
      const exist = await this.exist(task.jobId);
      if (exist) {
        this.stop(task.id);
      }
      await this.taskInfoEntity.delete({id});
      await this.taskLogEntity.delete({taskId: id});
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
      const runningTasks = await this.taskInfoEntity.findBy({status: 1});
      if (!_.isEmpty(runningTasks)) {
        for (const task of runningTasks) {
          const job = await this.exist(task.jobId); // 任务已存在就不添加
          if (!job) {
            this.logger.info(`init task ${task.name}`);
            await this.addOrUpdate(task);
          }
        }
      }
    } catch (e) {
    }
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
      {jobId},
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
    const info = await this.taskInfoEntity.findOneBy({id});
    return {
      ...info,
      repeatCount: info.limit,
    };
  }

  /**
   * 刷新任务状态
   */
  async updateStatus(jobId: number) {
    const task = await this.taskInfoEntity.findOneBy({id: jobId});
    if (!task) {
      return;
    }
    const result = await this.taskInfoQueue.getJobSchedulers();
    const job = _.find(result, {key: task.jobId});
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

  /**
   * 带超时控制的服务调用
   * @param serviceStr
   */
  async invokeServiceWithTimeout(serviceStr: string) {
    if (!serviceStr) return;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`任务执行超时 (${this.executionTimeout}ms)`));
      }, this.executionTimeout);
    });

    const servicePromise = this.invokeService(serviceStr);

    return Promise.race([servicePromise, timeoutPromise]);
  }

  /**
   * 检查卡住的任务并清理过期锁
   */
  async checkStuckTasks() {
    try {
      // Bull任务不需要锁机制，这里只做日志记录
      this.logger.debug('Bull任务健康检查完成 - Bull队列自带锁机制');

      // 检查是否有长时间运行的任务（超过配置的超时时间的2倍）
      const timeoutThreshold = this.executionTimeout * 2;
      const stuckTime = moment().subtract(timeoutThreshold, 'milliseconds').toDate();
      
      const runningTasks = await this.taskInfoEntity.find({
        where: {
          status: 1,
          lastExecuteTime: LessThan(stuckTime)
        }
      });

      if (runningTasks.length > 0) {
        this.logger.warn(`发现 ${runningTasks.length} 个可能卡住的Bull任务，建议检查队列状态`);
        for (const task of runningTasks) {
          this.logger.warn(`可能卡住的Bull任务: ${task.name} (ID: ${task.id}), 最后执行时间: ${task.lastExecuteTime}`);
        }
      }
    } catch (error) {
      this.logger.error('检查Bull任务状态时发生错误:', error);
    }
  }

  /**
   * 销毁时清理资源
   */
  destroy() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }
}
