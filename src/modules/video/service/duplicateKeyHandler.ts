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

/**
 * 数据库重复键冲突处理工具类
 * 专门处理视频采集过程中的重复键冲突问题
 */

import { ILogger, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { VideoEntity } from '../entity/videos';
import { BaseService } from '../../base/service/base';
import { VideoRulesEntity } from '../entity/video_rules';

const TAG = 'DuplicateKeyHandler';

@Provide()
export class DuplicateKeyHandler extends BaseService {
  @InjectEntityModel(VideoEntity)
  videoEntity: Repository<VideoEntity>;

  @InjectEntityModel(VideoRulesEntity)
  videoRulesEntity: Repository<VideoRulesEntity>;

  @Inject()
  logger: ILogger;

  /**
   * 判断是否为重复键错误
   */
  isDuplicateKeyError(error: any): boolean {
    return (
      error.code === 'ER_DUP_ENTRY' ||
      error.errno === 1062 ||
      error.sqlState === '23000' ||
      (error.message && error.message.includes('Duplicate entry')) ||
      (error.driverError && error.driverError.code === 'ER_DUP_ENTRY')
    );
  }

  /**
   * 判断是否为数据长度超限错误
   */
  isDataTooLongError(error: any): boolean {
    return (
      error.code === 'ER_DATA_TOO_LONG' ||
      error.errno === 1406 ||
      error.sqlState === '22001' ||
      (error.message && error.message.includes('Data too long for column')) ||
      (error.driverError && error.driverError.code === 'ER_DATA_TOO_LONG')
    );
  }

  /**
   * 提取数据超长的字段名
   */
  extractTooLongColumn(error: any): string | null {
    try {
      if (error.message && error.message.includes('Data too long for column')) {
        const match = error.message.match(/Data too long for column '([^']+)'/);
        return match ? match[1] : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 提取重复的键值
   */
  extractDuplicateKey(error: any): string | null {
    try {
      if (error.message && error.message.includes('Duplicate entry')) {
        const match = error.message.match(/Duplicate entry '([^']+)'/);
        return match ? match[1] : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 安全的视频插入/更新操作
   * 自动处理重复键冲突
   */
  async safeVideoInsert(
    videoData: Partial<VideoEntity>,
    queryRunner?: QueryRunner
  ): Promise<VideoEntity | null> {
    if (!videoData) {
      this.logger.warn(TAG, '视频数据为空');
      return null;
    }

    const useQueryRunner =
      queryRunner || this.videoEntity.manager.connection.createQueryRunner();
    const shouldManageTransaction = !queryRunner;

    try {
      if (shouldManageTransaction) {
        await useQueryRunner.connect();
        await useQueryRunner.startTransaction();
      }

      // 先尝试查找现有记录
      const existingVideo = await useQueryRunner.manager.findOne(VideoEntity, {
        where: { title: videoData.title },
        select: ['id', 'updateTime'],
      });

      let result: VideoEntity;

      if (existingVideo) {
        // 更新现有记录
        const updateData = this.prepareUpdateData(videoData);

        const updateRules = await this.videoRulesEntity.findOneBy({
          collection_id: videoData.collection_id,
        });

        // 检查更新规则并删除不允许更新的字段
        if (updateRules?.updateRules?.length) {
          const fieldsToKeep = new Set(updateRules.updateRules);
          for (const key in updateData) {
            if (!fieldsToKeep.has(key)) {
              delete updateData[key];
            }
          }
        }

        await useQueryRunner.manager.update(
          VideoEntity,
          { id: existingVideo.id },
          updateData
        );

        result = await useQueryRunner.manager.findOne(VideoEntity, {
          where: { id: existingVideo.id },
        });
      } else {
        // 插入新记录
        const insertData = this.prepareInsertData(videoData);
        result = await useQueryRunner.manager.save(VideoEntity, insertData);
      }

      if (shouldManageTransaction) {
        await useQueryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      if (shouldManageTransaction) {
        await useQueryRunner.rollbackTransaction();
      }

      // 处理数据长度超限错误
      if (this.isDataTooLongError(error)) {
        const columnName = this.extractTooLongColumn(error);
        // 截断超长数据并重试
        const truncatedData = this.truncateFieldData(videoData, columnName);
        return await this.safeVideoInsert(truncatedData, queryRunner);
      }

      // 如果仍然是重复键错误，尝试查找并更新
      if (this.isDuplicateKeyError(error)) {
        return await this.handleDuplicateConflict(videoData, useQueryRunner);
      }

      this.logger.error(
        TAG,
        `处理视频数据时发生未知错误: ${videoData.title || '未知标题'}`,
        error
      );
      throw error;
    } finally {
      if (shouldManageTransaction) {
        await useQueryRunner.release();
      }
    }
  }

  /**
   * 处理重复键冲突
   */
  private async handleDuplicateConflict(
    videoData: Partial<VideoEntity>,
    queryRunner: QueryRunner
  ): Promise<VideoEntity | null> {
    try {
      // 等待一小段时间后重试，避免并发冲突
      await new Promise(resolve => setTimeout(resolve, 100));

      const existingVideo = await queryRunner.manager.findOne(VideoEntity, {
        where: { title: videoData.title },
        select: ['id'],
      });

      if (existingVideo) {
        const updateData = this.prepareUpdateData(videoData);

        await queryRunner.manager.update(
          VideoEntity,
          { id: existingVideo.id },
          updateData
        );

        return await queryRunner.manager.findOne(VideoEntity, {
          where: { id: existingVideo.id },
        });
      } else {
        this.logger.error(TAG, `无法找到重复的视频记录: ${videoData.title}`);
        return null;
      }
    } catch (error) {
      this.logger.error(TAG, `处理重复键冲突失败: ${videoData.title}`, error);
      return null;
    }
  }

  /**
   * 准备插入数据（移除不应该插入的字段）
   */
  private prepareInsertData(
    videoData: Partial<VideoEntity>
  ): Partial<VideoEntity> {
    const { id, createTime, updateTime, ...insertData } = videoData;
    return insertData;
  }

  /**
   * 准备更新数据（移除不应该更新的字段）
   */
  private prepareUpdateData(
    videoData: Partial<VideoEntity>
  ): Partial<VideoEntity> {
    const { id, createTime, createUserId, ...updateData } = videoData;
    return updateData;
  }

  /**
   * 截断超长字段数据
   */
  private truncateFieldData(
    videoData: Partial<VideoEntity>,
    columnName: string | null
  ): Partial<VideoEntity> {
    const truncatedData = { ...videoData };

    if (!columnName) {
      return truncatedData;
    }

    // 根据字段名进行相应的截断处理
    switch (columnName) {
      case 'sub_title':
        if (truncatedData.sub_title && truncatedData.sub_title.length > 191) {
          truncatedData.sub_title =
            truncatedData.sub_title.substring(0, 188) + '...';
        }
        break;
      case 'title':
        if (truncatedData.title && truncatedData.title.length > 191) {
          truncatedData.title = truncatedData.title.substring(0, 188) + '...';
        }
        break;
      case 'video_tag':
        if (truncatedData.video_tag && truncatedData.video_tag.length > 191) {
          truncatedData.video_tag =
            truncatedData.video_tag.substring(0, 188) + '...';
        }
        break;
      case 'video_class':
        if (
          truncatedData.video_class &&
          truncatedData.video_class.length > 191
        ) {
          truncatedData.video_class =
            truncatedData.video_class.substring(0, 188) + '...';
        }
        break;
      case 'collection_name':
        if (
          truncatedData.collection_name &&
          truncatedData.collection_name.length > 256
        ) {
          truncatedData.collection_name =
            truncatedData.collection_name.substring(0, 253) + '...';
        }
        break;
      case 'unit':
        if (truncatedData.unit && truncatedData.unit.length > 32) {
          truncatedData.unit = truncatedData.unit.substring(0, 29) + '...';
        }
        break;
      default:
        this.logger.warn(
          TAG,
          `未处理的超长字段: ${columnName}, 视频: ${videoData.title}`
        );
        break;
    }

    return truncatedData;
  }

  /**
   * 批量安全插入
   */
  async batchSafeInsert(
    videoList: Partial<VideoEntity>[],
    batchSize = 5
  ): Promise<{ success: number; failed: number; results: VideoEntity[] }> {
    if (!videoList || videoList.length === 0) {
      return { success: 0, failed: 0, results: [] };
    }

    const results: VideoEntity[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < videoList.length; i += batchSize) {
      const batch = videoList.slice(i, i + batchSize);

      // 串行处理每个批次，避免并发冲突
      for (const videoData of batch) {
        try {
          const result = await this.safeVideoInsert(videoData);
          if (result) {
            results.push(result);
            successCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          failedCount++;
          this.logger.error(TAG, `批量插入失败: ${videoData.title}`, error);
        }
      }

      // 批次间添加小延时
      if (i + batchSize < videoList.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    this.logger.info(
      TAG,
      `批量插入完成，成功: ${successCount}, 失败: ${failedCount}`
    );

    return {
      success: successCount,
      failed: failedCount,
      results,
    };
  }
}
