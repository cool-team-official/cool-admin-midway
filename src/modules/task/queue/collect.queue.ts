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

import { App, Inject, Logger } from '@midwayjs/core';
import { BaseCoolQueue, CoolQueue } from '@cool-midway/task';
import { IMidwayApplication } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
import { CollectionService } from '../../video/service/collection';
import { PlayLineService } from '../../video/service/play_line';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { CollectionEntity } from '../../video/entity/collection';
import { TaskLogEntity } from '../entity/log';
import { Repository } from 'typeorm';

/**
 * 采集任务队列
 * 使用 BullMQ 实现异步队列处理，不阻塞主线程
 */
@CoolQueue({
  type: 'single',
  queue: {
    attempts: 1,
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 604800, count: 1000 },
  },
  worker: {
    concurrency: 1,
  },
})
export class CollectQueue extends BaseCoolQueue {
  @App()
  app: IMidwayApplication;

  @Logger()
  logger: ILogger;

  @Inject()
  collectionService: CollectionService;

  @Inject()
  playLineService: PlayLineService;

  @InjectEntityModel(CollectionEntity)
  collectionEntity: Repository<CollectionEntity>;

  @InjectEntityModel(TaskLogEntity)
  taskLogEntity: Repository<TaskLogEntity>;

  // 分批处理配置
  private readonly BATCH_SIZE = 10; // 每批处理的采集源数量

  /**
   * 队列数据消费方法
   * 在独立进程中执行，不阻塞主线程
   */
  async data(job: any, done: any): Promise<void> {
    const { taskType, taskId: dataTaskId, collectionId, keyWord } = job.data;
    const taskId = dataTaskId ?? job.id;
    const TAG = 'CollectQueue';

    try {
      this.logger.info(TAG, `开始执行任务: ${taskType}, 任务ID: ${taskId}`);

      switch (taskType) {
        case 'startCollection':
          await this.handleStartCollection();
          break;
        case 'dayAllCollections':
          await this.handleDayAllCollections(collectionId);
          break;
        case 'filterTask':
          await this.handleFilterTask();
          break;
        case 'playLineTask':
          await this.handlePlayLineTask();
          break;
        case 'singleCollection':
          await this.handleSingleCollection(collectionId);
          break;
        case 'keyWordCollection':
          await this.handleKeyWordCollection(keyWord);
          break;
        default:
          throw new Error(`未知任务类型: ${taskType}`);
      }

      this.logger.info(TAG, `任务执行完成: ${taskType}, 任务ID: ${taskId}`);
      await this.recordTaskLog(taskId, 1, 'success');
      done();
    } catch (error) {
      this.logger.error(TAG, `任务执行失败 [${taskType}]:`, error);

      await this.recordTaskLog(taskId, 0, error.message || 'error');

      // 抛出错误让队列按配置处理失败任务
      throw error;
    }
  }

  private async recordTaskLog(
    taskId: number,
    status: number,
    detail: string
  ): Promise<void> {
    try {
      await this.taskLogEntity.insert({
        detail,
        status,
        taskId,
      });
    } catch (error) {
      this.logger.error('CollectQueue', '记录采集任务日志失败:', error);
    }
  }

  /**
   * 处理启动采集任务
   */
  private async handleStartCollection(): Promise<void> {
    await this.collectionService.startCollection();
    await this.collectionService.waitForCollectionCompletion();
  }

  /**
   * 处理所有采集源的日常任务
   * 分批处理，每批并发执行
   */
  private async handleDayAllCollections(
    filterCollectionId?: number
  ): Promise<void> {
    // 如果指定了采集源ID，只处理该采集源
    const allCollections = filterCollectionId
      ? await this.collectionEntity.findBy({ id: filterCollectionId })
      : await this.collectionEntity.find({ select: ['id', 'name'] });

    if (!allCollections || allCollections.length === 0) {
      this.logger.info('CollectQueue', '没有找到任何采集源');
      return;
    }

    this.logger.info(
      'CollectQueue',
      `找到 ${allCollections.length} 个采集源，开始分批处理`
    );

    const failedCollections: string[] = [];
    for (let i = 0; i < allCollections.length; i += this.BATCH_SIZE) {
      const batch = allCollections.slice(i, i + this.BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(collection => this.collectionService.day(collection.id))
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const collection = batch[index];
          const detail = result.reason?.message || String(result.reason);
          failedCollections.push(`${collection.name}: ${detail}`);
          this.logger.error(
            'CollectQueue',
            `处理采集源 [${collection.id}] ${collection.name} 时发生错误:`,
            result.reason
          );
        }
      });
    }

    if (failedCollections.length > 0) {
      throw new Error(
        `采集源处理失败 (${failedCollections.length}): ${failedCollections.join(
          '; '
        )}`
      );
    }

    this.logger.info('CollectQueue', '所有采集源数据已推送，等待数据入库...');
    await this.collectionService.waitForCollectionCompletion();
    this.logger.info('CollectQueue', '所有数据入库完成');
  }

  /**
   * 处理单个采集源的任务
   */
  private async handleSingleCollection(collectionId: number): Promise<void> {
    await this.collectionService.day(collectionId);
    await this.collectionService.waitForCollectionCompletion();
  }

  /**
   * 处理过滤任务
   */
  private async handleFilterTask(): Promise<void> {
    const SQLQuery =
      'UPDATE video v SET play_url_put_in = CASE WHEN EXISTS (SELECT 1 FROM video_line vl WHERE vl.video_id = v.id) THEN 1 ELSE 0 END;';
    await this.collectionEntity.query(SQLQuery);
  }

  /**
   * 处理播放线路任务
   */
  private async handlePlayLineTask(): Promise<void> {
    await this.playLineService.merge();
  }

  /**
   * 处理关键字采集任务
   */
  private async handleKeyWordCollection(keyWord: string[]): Promise<void> {
    await this.collectionService.asyncKeyWord(keyWord);
  }
}
