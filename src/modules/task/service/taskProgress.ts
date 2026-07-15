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

import { Provide, Scope, ScopeEnum, Inject } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';

/**
 * 任务状态
 */
export enum TaskStatus {
  PENDING = 0, // 待处理
  RUNNING = 1, // 处理中
  SUCCESS = 2, // 成功
  FAILED = 3, // 失败
}

/**
 * 任务进度数据结构
 */
export interface TaskProgress {
  taskId: string; // 任务ID
  runId?: string; // 本次任务运行ID，用于区分复用 taskId 的历史任务
  status: TaskStatus; // 状态
  progress: number; // 进度百分比 0-100
  message?: string; // 状态消息
  taskType?: string; // 任务类型
  collectionId?: number; // 采集源ID
  collectionName?: string; // 采集源名称
  total?: number; // 总数
  processed?: number; // 已处理数
  result?: any; // 成功时的结果数据
  errorMsg?: string; // 失败时的错误信息
  timestamp: number; // 时间戳
}

/**
 * 任务进度服务
 * 基于 Redis 实现任务状态管理
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class TaskProgressService {
  @Inject()
  redisService: RedisService;

  // Redis key 前缀
  private readonly KEY_PREFIX = 'task:progress:';
  // 过期时间：1天
  private readonly TTL = 86400;

  /**
   * 设置任务进度
   * @param taskId 任务ID
   * @param data 进度数据
   */
  async setProgress(
    taskId: string,
    data: Partial<TaskProgress>
  ): Promise<void> {
    const key = this.KEY_PREFIX + taskId;
    const existing = await this.getProgress(taskId);

    const progress: TaskProgress = {
      taskId,
      runId: data.runId ?? existing?.runId,
      status: data.status ?? existing?.status ?? TaskStatus.PENDING,
      progress: data.progress ?? existing?.progress ?? 0,
      message: data.message,
      taskType: data.taskType ?? existing?.taskType,
      collectionId:
        data.collectionId !== undefined
          ? data.collectionId
          : existing?.collectionId,
      collectionName:
        data.collectionName !== undefined
          ? data.collectionName
          : existing?.collectionName,
      total: data.total ?? existing?.total,
      processed: data.processed ?? existing?.processed,
      result: data.result,
      errorMsg: data.errorMsg,
      timestamp: Date.now(),
    };

    await this.redisService.set(key, JSON.stringify(progress), 'EX', this.TTL);
  }

  /**
   * 获取任务进度
   * @param taskId 任务ID
   */
  async getProgress(taskId: string): Promise<TaskProgress | null> {
    const key = this.KEY_PREFIX + taskId;
    const data = await this.redisService.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * 初始化刚入队的任务进度，避免复用旧 taskId 时读到历史完成状态
   * @param taskId 任务ID
   * @param taskType 任务类型
   * @param runId 本次任务运行ID
   * @param metadata 任务元数据
   */
  async initQueuedTask(
    taskId: string,
    taskType: string,
    runId: string,
    metadata: Pick<
      Partial<TaskProgress>,
      'collectionId' | 'collectionName'
    > = {}
  ): Promise<void> {
    const key = this.KEY_PREFIX + taskId;
    const progress: TaskProgress = {
      taskId,
      runId,
      status: TaskStatus.PENDING,
      progress: 0,
      message: `任务已加入队列: ${taskType}`,
      taskType,
      collectionId: metadata.collectionId,
      collectionName: metadata.collectionName,
      processed: 0,
      timestamp: Date.now(),
    };

    // 用 Lua 保证判断和写入不可分割，避免消费者刚写完进度后被反写成 PENDING。
    await this.redisService.eval(
      `
        local existing = redis.call('GET', KEYS[1])
        if existing then
          local ok, data = pcall(cjson.decode, existing)
          if ok and data.runId == ARGV[1] then
            return 0
          end
        end
        redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
        return 1
      `,
      1,
      key,
      runId,
      JSON.stringify(progress),
      String(this.TTL)
    );
  }

  /**
   * 删除任务进度
   * @param taskId 任务ID
   */
  async deleteProgress(taskId: string): Promise<void> {
    const key = this.KEY_PREFIX + taskId;
    await this.redisService.del(key);
  }

  /**
   * 更新进度百分比
   * @param taskId 任务ID
   * @param progress 进度 0-100
   * @param message 状态消息
   */
  async updateProgress(
    taskId: string,
    progress: number,
    message?: string
  ): Promise<void> {
    await this.setProgress(taskId, { progress, message });
  }

  /**
   * 标记任务开始
   */
  async startTask(
    taskId: string,
    taskType: string,
    runId?: string
  ): Promise<void> {
    await this.setProgress(taskId, {
      status: TaskStatus.RUNNING,
      progress: 0,
      taskType,
      runId,
      message: `任务开始: ${taskType}`,
    });
  }

  /**
   * 标记任务成功
   */
  async successTask(taskId: string, result?: any): Promise<void> {
    const key = this.KEY_PREFIX + taskId;
    const existing = await this.getProgress(taskId);
    const progress: TaskProgress = {
      taskId,
      runId: existing?.runId,
      status: TaskStatus.SUCCESS,
      progress: 100,
      message: '任务完成',
      taskType: existing?.taskType,
      collectionId: existing?.collectionId,
      collectionName: existing?.collectionName,
      result,
      timestamp: Date.now(),
    };
    await this.redisService.set(key, JSON.stringify(progress), 'EX', this.TTL);
  }

  /**
   * 标记任务失败
   */
  async failTask(taskId: string, errorMsg: string): Promise<void> {
    const key = this.KEY_PREFIX + taskId;
    const existing = await this.getProgress(taskId);
    const progress: TaskProgress = {
      taskId,
      runId: existing?.runId,
      status: TaskStatus.FAILED,
      progress: 0,
      taskType: existing?.taskType,
      collectionId: existing?.collectionId,
      collectionName: existing?.collectionName,
      errorMsg,
      message: `任务失败: ${errorMsg}`,
      timestamp: Date.now(),
    };
    await this.redisService.set(key, JSON.stringify(progress), 'EX', this.TTL);
  }
}
