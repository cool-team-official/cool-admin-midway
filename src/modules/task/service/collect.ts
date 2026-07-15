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

import { Inject, Logger, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { ILogger } from '@midwayjs/logger';
import { CollectQueue } from '../queue/collect.queue';

/**
 * TaskCollectService
 * 任务调度服务，通过队列异步执行采集任务
 */
const TAG = 'TaskCollectService';

@Provide()
export class TaskCollectService extends BaseService {
  @Logger()
  logger: ILogger;

  @Inject()
  collectQueue: CollectQueue;

  private async addCollectJob(
    taskType: string,
    taskId: number,
    data: Record<string, any> = {}
  ): Promise<void> {
    const job = await this.collectQueue.add({
      taskType,
      taskId,
      ...data,
    });

    this.logger.info(TAG, `任务已添加到队列，任务ID: ${job.id}`);
  }

  /**
   * 启动采集任务
   * 添加任务到队列，立即返回，不阻塞主线程
   */
  async startCollection(): Promise<void> {
    this.logger.info(TAG, '启动采集任务已添加到队列');

    return this.addCollectJob('startCollection', 1);
  }

  /**
   * 执行所有采集源的日常任务
   * 添加任务到队列，立即返回，不阻塞主线程
   * @param collectionId 指定的采集源ID，不传则处理所有
   */
  async dayCollectionTask(collectionId?: number): Promise<void> {
    this.logger.info(TAG, '日常采集任务已添加到队列');

    return this.addCollectJob('dayAllCollections', 2, { collectionId });
  }

  /**
   * 执行过滤任务
   * 添加任务到队列，立即返回，不阻塞主线程
   */
  async filterTask(): Promise<void> {
    this.logger.info(TAG, '过滤任务已添加到队列');

    return this.addCollectJob('filterTask', 3);
  }

  /**
   * 执行播放线路任务
   * 添加任务到队列，立即返回，不阻塞主线程
   */
  async playLineTask(): Promise<void> {
    this.logger.info(TAG, '播放线路任务已添加到队列');

    return this.addCollectJob('playLineTask', 4);
  }

  /**
   * 根据关键字采集
   * 添加任务到队列，立即返回，不阻塞主线程
   * @param keyWord 关键字数组
   */
  async keyWordCollection(keyWord: string[]): Promise<void> {
    this.logger.info(TAG, '关键字采集任务已添加到队列');

    return this.addCollectJob('keyWordCollection', 5, { keyWord });
  }
}
