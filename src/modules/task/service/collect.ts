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

import {Inject, Logger, Provide} from '@midwayjs/core';
import {BaseService} from '@cool-midway/core';
import {ILogger} from '@midwayjs/logger';
import {CollectionService} from "../../video/service/collection";
import {InjectEntityModel} from "@midwayjs/typeorm";
import {CollectionEntity} from "../../video/entity/collection";
import {Repository} from "typeorm";
import {PlayLineService} from "../../video/service/play_line";
import {TaskLogEntity} from "../entity/log";

/**
 * TaskCollectService
 */
const TAG: String = 'TaskCollectService';

@Provide()
export class TaskCollectService extends BaseService {
  @Logger()
  logger: ILogger;

  @Inject()
  playLineService: PlayLineService;

  @Inject()
  collectionService: CollectionService;


  @InjectEntityModel(CollectionEntity)
  collectionEntity: Repository<CollectionEntity>;


  @InjectEntityModel(TaskLogEntity)
  taskLogEntity: Repository<TaskLogEntity>;


  // 分批处理配置
  private readonly BATCH_SIZE = 5; // 每批处理的采集源数量
  private readonly BATCH_DELAY = 1000; // 批次之间的延迟（毫秒）

  async startCollection(): Promise<void> {
    try {
      await this.collectionService.startCollection();
      await this.taskLogEntity.insert({
        detail: "success",
        status: 1,
        taskId: 1,
      });
    } catch (error) {
      await this.taskLogEntity.insert({
        detail: error.message || "error",
        status: 0,
        taskId: 1,
      });
      throw error;
    }
  }

  /**
   * 处理单个采集源
   */
  private async processSingleCollection(id: number, name: string): Promise<void> {
    try {
      // 调用采集服务的day方法
      await this.collectionService.day(id);
    } catch (error) {
      this.logger.error(TAG, `处理采集源 [${id}] ${name} 时发生错误:`, error);
      // 不抛出错误，让其他采集源继续处理
    }
  }

  /**
   * 执行采集任务（在后台运行）
   */
  async dayCollectionTask(): Promise<void> {
    try {
      const allCollections = await this.collectionEntity.find({
        select: ['id', 'name']
      });

      if (!allCollections || allCollections.length === 0) {
        this.logger.info(TAG, "没有找到任何采集源");
        return;
      }

      this.logger.info(TAG, `找到 ${allCollections.length} 个采集源，开始分批处理`);

      for (let i = 0; i < allCollections.length; i += this.BATCH_SIZE) {
        const batch = allCollections.slice(i, i + this.BATCH_SIZE);

        this.logger.info(TAG, `处理第 ${Math.floor(i / this.BATCH_SIZE) + 1} 批次，包含 ${batch.length} 个采集源`);

        const promises = batch.map(collection =>
          this.processSingleCollection(collection.id, collection.name)
        );

        await Promise.all(promises);

        if (i + this.BATCH_SIZE < allCollections.length) {
          this.logger.info(TAG, `批次处理完成，等待 ${this.BATCH_DELAY}ms 后继续下一批`);
          await this.delay(this.BATCH_DELAY);
        }
      }

      this.logger.info(TAG, `所有 ${allCollections.length} 个采集源处理完成`);
      await this.taskLogEntity.insert({
        detail: "success",
        status: 1,
        taskId: 2,
      });
    } catch (error) {
      await this.taskLogEntity.insert({
        detail: error.message || "error",
        status: 0,
        taskId: 2,
      });
      throw error;
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 执行过滤任务（在后台运行）
   */
  async filterTask(): Promise<void> {
    try {
      const SQLQuery =
        'UPDATE video v SET play_url_put_in = CASE WHEN EXISTS (SELECT 1 FROM video_line vl WHERE vl.video_id = v.id) THEN 1 ELSE 0 END;';
      await this.nativeQuery(SQLQuery);
      await this.taskLogEntity.insert({
        detail: "success",
        status: 1,
        taskId: 3,
      });
    } catch (error) {
      await this.taskLogEntity.insert({
        detail: error.message || "error",
        status: 0,
        taskId: 3,
      });
      throw error;
    }
  }


  /**
   * 执行播放线路任务（在后台运行）
   */
  async playLineTask(): Promise<void> {
    try {
      await this.playLineService.merge();
      await this.taskLogEntity.insert({
        detail: "success",
        status: 1,
        taskId: 4,
      });
    } catch (error) {
      await this.taskLogEntity.insert({
        detail: error.message || "error",
        status: 0,
        taskId: 4,
      });
      throw error;
    }
  }
}
