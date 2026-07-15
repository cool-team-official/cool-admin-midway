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

import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { ILogger, Inject, InjectClient, Provide } from '@midwayjs/core';
import { PlayLineEntity } from '../entity/play_line';
import { Line } from '../bean/SourceVideo';
import axios from 'axios';
import { VideoLineEntity } from '../entity/video_line';
import { playFileMergeSQL } from './play_file_merge';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

const TAG = 'PlayLineService';

@Provide()
export class PlayLineService extends BaseService {
  @InjectEntityModel(PlayLineEntity)
  playLineEntity: Repository<PlayLineEntity>;

  @InjectEntityModel(VideoLineEntity)
  videoLineEntity: Repository<VideoLineEntity>;

  @Inject()
  logger: ILogger;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  private readonly CACHE_TTL = 300; // 缓存时间5分钟
  private readonly BATCH_SIZE = 100; // 每批处理的数据量
  private readonly CACHE_CHECK_BATCH_SIZE = 50; // 每次并行检查缓存的条数

  /**
   * 批量插入播放线路
   * @param playLines 播放线路数据数组
   * @returns 插入结果统计
   */
  async batchInsert(
    playLines: Line[]
  ): Promise<{ successCount: number; skipCount: number }> {
    if (!playLines || playLines.length === 0) {
      return { successCount: 0, skipCount: 0 };
    }

    let successCount = 0;
    let skipCount = 0;
    const totalLines = playLines.length;

    try {
      if (!this.playLineEntity) {
        this.logger.error(TAG, 'PlayLineEntity 数据源未正确初始化');
        throw new Error('PlayLineEntity 数据源未正确初始化');
      }

      this.logger.info(TAG, `开始批量插入播放线路，总计 ${totalLines} 条`);

      const cacheKeyPrefix = 'playLine:file:';

      for (let i = 0; i < playLines.length; i += this.BATCH_SIZE) {
        const batch = playLines.slice(
          i,
          Math.min(i + this.BATCH_SIZE, playLines.length)
        );
        const batchNum = Math.floor(i / this.BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(playLines.length / this.BATCH_SIZE);

        this.logger.info(
          TAG,
          `处理第 ${batchNum}/${totalBatches} 批，本批 ${batch.length} 条`
        );

        const batchResult = await this.processBatch(batch, cacheKeyPrefix);
        successCount += batchResult.successCount;
        skipCount += batchResult.skipCount;

        this.logger.info(
          TAG,
          `第 ${batchNum}/${totalBatches} 批处理完成，成功 ${batchResult.successCount} 条，跳过 ${batchResult.skipCount} 条`
        );
      }

      this.logger.info(
        TAG,
        `批量插入播放线路完成，总计成功 ${successCount} 条，跳过 ${skipCount} 条`
      );
    } catch (error) {
      this.logger.error(TAG, '批量插入播放线路异常', error);
      throw error;
    }

    return { successCount, skipCount };
  }

  private async processBatch(
    batch: Line[],
    cacheKeyPrefix: string
  ): Promise<{ successCount: number; skipCount: number }> {
    let successCount = 0;
    let skipCount = 0;

    const validPlayLines: Line[] = [];

    for (let i = 0; i < batch.length; i += this.CACHE_CHECK_BATCH_SIZE) {
      const checkBatch = batch.slice(
        i,
        Math.min(i + this.CACHE_CHECK_BATCH_SIZE, batch.length)
      );

      const checkResults = await Promise.allSettled(
        checkBatch.map(async data => {
          if (
            !data ||
            !data.video_line_id ||
            data.video_line_id === null ||
            data.video_line_id === undefined
          ) {
            return { valid: false, reason: 'invalid_video_line_id' };
          }

          const cacheKey = `${cacheKeyPrefix}${data.file}`;
          const cachedExists = await this.midwayCache.get(cacheKey);

          if (cachedExists) {
            return { valid: false, reason: 'cached', data };
          }

          return { valid: true, data };
        })
      );

      for (const result of checkResults) {
        if (result.status === 'fulfilled') {
          if (result.value.valid) {
            validPlayLines.push(result.value.data);
          } else if (result.value.reason === 'invalid_video_line_id') {
            skipCount++;
          } else if (result.value.reason === 'cached') {
            skipCount++;
          }
        } else {
          this.logger.warn(TAG, `缓存检查失败: ${result.reason}`);
          skipCount++;
        }
      }
    }

    if (validPlayLines.length === 0) {
      return { successCount: 0, skipCount: batch.length };
    }

    const playLineData = validPlayLines.map(data => ({
      name: data.name,
      file: data.file,
      sub_title: data.sub_title,
      video_id: data.video_id,
      video_name: data.video_name,
      tag: data.tag,
      sort: data.sort,
      collection_id: data.collection_id,
      collection_name: data.collection_name,
      video_line_id: data.video_line_id,
      status: 1,
      vip: 0,
    }));

    try {
      const upsertResult = await this.playLineEntity.upsert(playLineData, [
        'file',
      ]);

      if (upsertResult.identifiers && upsertResult.identifiers.length > 0) {
        successCount = upsertResult.identifiers.length;

        const cachePromises = validPlayLines.map(data =>
          this.midwayCache.set(
            `${cacheKeyPrefix}${data.file}`,
            true,
            this.CACHE_TTL
          )
        );
        await Promise.allSettled(cachePromises);
      }
    } catch (insertError) {
      if (
        insertError.code === 'ER_DUP_ENTRY' ||
        insertError.errno === 1062 ||
        (insertError.message && insertError.message.includes('Duplicate entry'))
      ) {
        this.logger.warn(TAG, '批量插入遇到重复键，回退到逐个插入');

        for (const data of validPlayLines) {
          try {
            await this.insert(data);
            successCount++;
          } catch (singleError) {
            if (this.isDuplicateKeyError(singleError)) {
              skipCount++;
            } else {
              this.logger.error(
                TAG,
                `插入播放线路失败: ${data.file}`,
                singleError
              );
            }
          }
        }
      } else {
        throw insertError;
      }
    }

    return { successCount, skipCount };
  }

  /**
   * 判断是否为重复键错误
   */
  private isDuplicateKeyError(error: any): boolean {
    return (
      error.code === 'ER_DUP_ENTRY' ||
      error.errno === 1062 ||
      (error.message && error.message.includes('Duplicate entry'))
    );
  }

  /**
   * 插入单条播放线路
   */
  async insert(data: Line): Promise<void> {
    if (!data) {
      this.logger.warn(TAG, '播放线路数据为空');
      return;
    }

    // 如果 data.video_line_id 不存在或无效，就不执行以下逻辑
    // 使用严格检查：null、undefined、0 都视为无效
    if (
      !data.video_line_id ||
      data.video_line_id === null ||
      data.video_line_id === undefined
    ) {
      return;
    }

    // 检查数据源是否可用
    if (!this.playLineEntity) {
      this.logger.error(TAG, 'PlayLineEntity 数据源未正确初始化');
      throw new Error('PlayLineEntity 数据源未正确初始化');
    }

    // 优化：使用缓存避免重复查询
    const cacheKey = `playLine:file:${data.file}`;
    const cachedExists = await this.midwayCache.get(cacheKey);

    if (cachedExists) {
      this.logger.debug(TAG, `播放线路已存在，跳过: ${data.file}`);
      return;
    }

    try {
      // 先检查是否存在相同 file 的记录
      const existing = await this.playLineEntity.findOne({
        where: { file: data.file },
      });

      if (existing) {
        // 如果存在，只更新必要的字段
        // 由于前面已经检查过 data.video_line_id 有效，这里直接使用
        const updateData: Partial<Line> = {
          name: data.name,
          file: data.file,
          sub_title: data.sub_title,
          video_id: data.video_id,
          video_name: data.video_name,
          tag: data.tag,
          sort: data.sort,
          collection_id: data.collection_id,
          collection_name: data.collection_name,
          video_line_id: data.video_line_id,
        };
        await this.playLineEntity.update({ file: data.file }, updateData);
        this.logger.info(
          TAG,
          `update ${data.collection_name} ${data.video_name} ${data.name} video_line_id ${data.video_line_id}  success`
        );
      } else {
        // 如果不存在，插入新记录
        await this.playLineEntity.save(data);
        this.logger.info(
          TAG,
          `insert ${data.collection_name} ${data.video_name} ${data.name} video_line_id ${data.video_line_id}  success`
        );
      }

      // 缓存存在标记
      await this.midwayCache.set(cacheKey, true, this.CACHE_TTL);
    } catch (error) {
      // 检查是否是数据源错误
      if (
        error &&
        error.message &&
        error.message.includes('DataSource undefined not found')
      ) {
        this.logger.error(
          TAG,
          `数据源错误: ${data.collection_name} ${data.video_name} ${data.name}`,
          error
        );
        throw error;
      }

      // 如果仍然出现重复键错误，尝试更新
      if (
        error.code === 'ER_DUP_ENTRY' ||
        error.errno === 1062 ||
        (error.message && error.message.includes('Duplicate entry'))
      ) {
        try {
          // 更新时也要确保 video_line_id 有效
          const updateData: Partial<Line> = {
            name: data.name,
            file: data.file,
            sub_title: data.sub_title,
            video_id: data.video_id,
            video_name: data.video_name,
            tag: data.tag,
            sort: data.sort,
            collection_id: data.collection_id,
            collection_name: data.collection_name,
            video_line_id: data.video_line_id,
          };
          await this.playLineEntity.update({ file: data.file }, updateData);
          this.logger.info(
            TAG,
            `update (duplicate key) ${data.collection_name} ${data.video_name} ${data.name} video_line_id ${data.video_line_id}  success`
          );

          // 缓存存在标记
          await this.midwayCache.set(cacheKey, true, this.CACHE_TTL);
        } catch (updateError) {
          // 检查是否是数据源错误
          if (
            updateError &&
            updateError.message &&
            updateError.message.includes('DataSource undefined not found')
          ) {
            this.logger.error(
              TAG,
              `数据源错误 (更新阶段): ${data.collection_name} ${data.video_name} ${data.name}`,
              updateError
            );
            throw updateError;
          }

          this.logger.error(
            TAG,
            `update failed for ${data.collection_name} ${data.video_name} ${data.name}:`,
            updateError.message
          );
          throw updateError;
        }
      } else {
        this.logger.error(
          TAG,
          `insert failed for ${data.collection_name} ${data.video_name} ${data.name}:`,
          error.message
        );
        throw error;
      }
    }
  }

  /**
   * 检查链接是否可以访问
   * @param url 要检查的链接
   * @returns 如果链接可访问返回true，否则返回false
   */
  async isUrlAccessible(url: string): Promise<boolean> {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return false;
    }

    try {
      // 发送HEAD请求检查链接是否可访问
      await axios.head(url, {
        timeout: 5000, // 5秒超时
      });
      return true;
    } catch (error) {
      this.logger.debug(TAG, `链接 ${url} 无法访问:`, error.message);
      return false;
    }
  }

  /**
   * 根据视频ID查询所有播放线路并按collection_id分组
   */
  async startVip(
    video_id: number,
    vipNumber: number
  ): Promise<{ [collection_id: number]: PlayLineEntity[] }> {
    if (!video_id || typeof video_id !== 'number') {
      this.logger.warn(TAG, '视频ID必须是有效的数字');
      return {};
    }

    const cacheKey = `playLines:grouped:${video_id}`;

    // 尝试从缓存获取分组数据
    const cachedData = await this.midwayCache.get(cacheKey);
    if (cachedData) {
      this.logger.debug(TAG, `从缓存获取分组播放线路: ${video_id}`);
      return cachedData as { [collection_id: number]: PlayLineEntity[] };
    }

    const playLines = await this.playLineEntity.find({
      where: { video_id },
      order: { sort: 'ASC' },
    });
    const groupedPlayLines = playLines.reduce((acc, playLine) => {
      if (!acc[playLine.collection_id]) {
        acc[playLine.collection_id] = [];
      }
      acc[playLine.collection_id].push(playLine);
      return acc;
    }, {} as { [collection_id: number]: PlayLineEntity[] });

    // 优化：使用批量更新代替逐个保存
    const idsToUpdate: number[] = [];
    Object.values(groupedPlayLines).forEach(playLines => {
      if (vipNumber >= 0 && vipNumber < playLines.length) {
        for (let i = vipNumber; i < playLines.length; i++) {
          idsToUpdate.push(playLines[i].id);
        }
      }
    });

    if (idsToUpdate.length > 0) {
      await this.playLineEntity.update({ id: In(idsToUpdate) }, { vip: 1 });
      this.logger.info(TAG, `批量更新VIP状态: ${idsToUpdate.length} 条记录`);
    }

    // 缓存分组数据
    await this.midwayCache.set(cacheKey, groupedPlayLines, this.CACHE_TTL);

    return groupedPlayLines;
  }

  /**
   * 取消VIP状态
   */
  async cancelVip(video_id: number): Promise<void> {
    if (!video_id || typeof video_id !== 'number') {
      this.logger.warn(TAG, '视频ID必须是有效的数字');
      return;
    }

    await this.playLineEntity.update({ video_id: video_id }, { vip: 0 });
  }

  /**
   * 删除异常的播放线路
   */
  async delete(ids: number[]): Promise<void> {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      this.logger.warn(TAG, '删除ID数组不能为空');
      return;
    }

    const playLine = await this.playLineEntity.findBy({ id: In(ids) });
    for (const line of playLine) {
      await this.playLineEntity.delete(line.id);
      if (line.video_line_id) {
        await this.videoLineEntity.delete(line.video_line_id);
      }
    }
  }

  /**
   * 合并播放线路
   */
  async merge(): Promise<string> {
    try {
      await this.nativeQuery(playFileMergeSQL);
      return '任务执行成功';
    } catch (error) {
      this.logger.error(TAG, '合并操作失败:', error.message);
      throw error;
    }
  }

  /**
   * 根据视频ID批量删除播放线路
   */
  idsDelete(ids: number[] | string[]): void {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      this.logger.warn(TAG, '删除ID数组不能为空');
      return;
    }

    // 将数字转换为字符串以匹配 bigint 类型
    const stringIds = ids.map(id => id.toString());
    this.playLineEntity.delete({
      video_id: In(stringIds),
    });
  }
}
