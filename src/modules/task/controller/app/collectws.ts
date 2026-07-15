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
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
  App,
} from '@midwayjs/core';
import { Context } from '@midwayjs/socketio';
import { IMidwayApplication } from '@midwayjs/core';
import { CollectQueue } from '../../queue/collect.queue';

/**
 * 采集任务 WebSocket 控制器
 * 前端通过 Socket.io 连接此控制器，实时获取采集任务进度
 */
@WSController('/collect')
export class CollectWSController {
  @App()
  app: IMidwayApplication;

  @Inject()
  ctx: Context;

  @Inject()
  collectQueue: CollectQueue;

  /**
   * 客户端连接
   */
  @OnWSConnection()
  async onConnectionMethod() {
    console.log('采集任务 WebSocket 客户端连接', this.ctx.id);
    console.log('连接参数', this.ctx.handshake.query);

    // 发送连接成功消息
    this.ctx.emit('connected', {
      message: '已连接到采集任务服务',
      timestamp: Date.now(),
    });
  }

  /**
   * 订阅采集任务进度
   * 前端发送: { event: 'subscribe', taskId: 'xxx' }
   * 或者按采集源订阅: { event: 'subscribe', collectionId: 123 }
   */
  @OnWSMessage('subscribe')
  async onSubscribe(data: { taskId?: string; collectionId?: number }) {
    console.log('订阅采集任务进度', this.ctx.id, data);

    if (data.taskId) {
      // 订阅特定任务
      this.ctx.join(`task:${data.taskId}`);
      this.ctx.emit('subscribed', {
        taskId: data.taskId,
        message: '已订阅采集任务进度',
      });
    } else if (data.collectionId) {
      // 订阅特定采集源
      this.ctx.join(`collection:${data.collectionId}`);
      this.ctx.emit('subscribed', {
        collectionId: data.collectionId,
        message: '已订阅采集源进度',
      });
    }
  }

  /**
   * 取消订阅采集任务进度
   */
  @OnWSMessage('unsubscribe')
  async onUnsubscribe(data: { taskId?: string; collectionId?: number }) {
    console.log('取消订阅采集任务进度', this.ctx.id, data);

    if (data.taskId) {
      this.ctx.leave(`task:${data.taskId}`);
      this.ctx.emit('unsubscribed', {
        taskId: data.taskId,
        message: '已取消订阅采集任务进度',
      });
    } else if (data.collectionId) {
      this.ctx.leave(`collection:${data.collectionId}`);
      this.ctx.emit('unsubscribed', {
        collectionId: data.collectionId,
        message: '已取消订阅采集源进度',
      });
    }
  }

  /**
   * 查询任务队列状态
   */
  @OnWSMessage('getStatus')
  async onGetStatus() {
    try {
      // 获取队列状态
      const queue = this.collectQueue.queue as any;
      if (!queue) {
        this.ctx.emit('status', { error: '队列未初始化' });
        return;
      }

      // 获取队列统计信息
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount?.() || 0,
        queue.getActiveCount?.() || 0,
        queue.getCompletedCount?.() || 0,
        queue.getFailedCount?.() || 0,
      ]);

      this.ctx.emit('status', {
        waiting,
        active,
        completed,
        failed,
        total: waiting + active + completed + failed,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.ctx.emit('status', { error: error.message });
    }
  }
}
