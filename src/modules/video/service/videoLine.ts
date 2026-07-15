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
import { VideoEntity } from '../entity/videos';
import { VideoLineEntity } from '../entity/video_line';
import { ILogger, Inject, InjectClient, Provide } from '@midwayjs/core';
import { CollectionEntity } from '../entity/collection';
import { Line } from '../bean/SourceVideo';
import { PlayLineService } from './play_line';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

const TAG = 'VideoLineService';

@Provide()
export class VideoLineService extends BaseService {
  @InjectEntityModel(VideoLineEntity)
  videoLineEntity: Repository<VideoLineEntity>;
  @Inject()
  playLineService: PlayLineService;

  @Inject()
  logger: ILogger;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  private readonly CACHE_TTL = 300; // 缓存时间5分钟

  /**
   * 排序查询（添加缓存）
   */
  async line(query: any): Promise<VideoLineEntity | null> {
    if (!query || !query.id) {
      this.logger.warn(TAG, '查询参数无效，缺少id');
      return null;
    }

    const cacheKey = `videoLine:line:${query.id}`;

    // 尝试从缓存获取数据
    const cachedData = await this.midwayCache.get(cacheKey);
    if (
      cachedData &&
      typeof cachedData === 'object' &&
      (cachedData as any).video_id
    ) {
      this.logger.debug(TAG, `从缓存获取视频线路: ${cacheKey}`);
      return cachedData as VideoLineEntity;
    }

    //通过query.id查询videoLineEntity的数据
    const videoLineEntity = await this.videoLineEntity.findOne({
      where: {
        id: query.id,
      },
    });

    // 缓存结果
    if (videoLineEntity) {
      await this.midwayCache.set(cacheKey, videoLineEntity, this.CACHE_TTL);
      this.logger.debug(TAG, `视频线路已缓存: ${cacheKey}`);
    }

    return videoLineEntity;
  }

  /**
   * 解析视频列表
   */
  parseVideoList(
    videoEntity: VideoEntity,
    collectionEntity: CollectionEntity,
    videoLineEntityId: number
  ): Array<Line> {
    if (!videoEntity || !collectionEntity || !videoLineEntityId) {
      this.logger.warn(TAG, '解析视频列表参数无效');
      return [];
    }

    try {
      // 检查 play_url 是否存在
      if (!videoEntity.play_url) {
        this.logger.warn(
          TAG,
          `视频 [${videoEntity.title}] play_url 为空，无法解析播放线路`
        );
        return [];
      }

      // 使用 '#' 分割字符串，得到每一集的字符串
      const episodes = videoEntity.play_url.split('#');

      // 检查是否有有效的集数数据
      if (episodes.length === 0 || (episodes.length === 1 && !episodes[0])) {
        this.logger.warn(
          TAG,
          `视频 [${
            videoEntity.title
          }] play_url 格式错误，无法解析: ${videoEntity.play_url.substring(
            0,
            100
          )}`
        );
        return [];
      }

      // 初始化结果数组
      const result: Array<Line> = [];
      let skippedCount = 0;

      // 遍历每一集的字符串
      episodes.forEach((episode, index) => {
        if (!episode) return;

        // 使用 '$' 分割字符串，分离出集数和 URL
        const parts = episode.split('$');

        // 检查分割结果
        if (parts.length !== 2) {
          this.logger.warn(
            TAG,
            `视频 [${videoEntity.title}] 第${
              index + 1
            }集格式错误，缺少$分隔符: ${episode.substring(0, 50)}`
          );
          skippedCount++;
          return;
        }

        const [title, url] = parts;
        // 去除可能存在的多余空格
        const trimmedTitle = title?.trim();
        const trimmedUrl = url?.trim();

        // 如果集数和 URL 都存在，则添加到结果数组中
        if (trimmedTitle && trimmedUrl) {
          result.push({
            name: trimmedTitle,
            file: trimmedUrl,
            sub_title: trimmedTitle,
            video_id: videoEntity.id,
            video_name: videoEntity.title,
            tag: collectionEntity.param,
            sort: index,
            video_line_id: videoLineEntityId,
            collection_id: collectionEntity.id,
            collection_name: collectionEntity.name,
          });
        } else {
          this.logger.warn(
            TAG,
            `视频 [${videoEntity.title}] 第${index + 1}集标题或URL为空，已跳过`
          );
          skippedCount++;
        }
      });

      // 输出解析统计
      if (skippedCount > 0) {
        this.logger.warn(
          TAG,
          `视频 [${videoEntity.title}] 解析完成：成功${result.length}集，跳过${skippedCount}集`
        );
      }

      return result;
    } catch (error) {
      this.logger.error(TAG, `解析视频列表失败 [${videoEntity.title}]:`, error);
      return [];
    }
  }

  /**
   * 批量插入视频线路
   * @param videoEntities 视频实体数组
   * @param collectionEntity 集合实体
   * @param forceUpdate 是否强制更新（忽略缓存）
   * @returns 插入结果统计
   */
  async batchInsert(
    videoEntities: VideoEntity[],
    collectionEntity: CollectionEntity,
    forceUpdate = false
  ): Promise<{ successCount: number; skipCount: number }> {
    if (!videoEntities || videoEntities.length === 0) {
      return { successCount: 0, skipCount: 0 };
    }

    if (!collectionEntity || !collectionEntity.id) {
      this.logger.warn(TAG, '集合实体无效');
      return { successCount: 0, skipCount: videoEntities.length };
    }

    let successCount = 0;
    let skipCount = 0;

    try {
      const collectionId = collectionEntity.id;
      const cacheKeyPrefix = `videoLine:exists:${collectionId}:`;

      // 过滤已缓存的视频线路
      const validVideos: VideoEntity[] = [];
      for (const videoEntity of videoEntities) {
        if (!videoEntity || !videoEntity.id) {
          skipCount++;
          continue;
        }

        // 如果强制更新，跳过缓存检查
        if (!forceUpdate) {
          const cacheKey = `${cacheKeyPrefix}${videoEntity.id}`;
          const existsInCache = await this.midwayCache.get(cacheKey);

          if (existsInCache) {
            this.logger.debug(
              TAG,
              `视频线路已存在，跳过: ${videoEntity.title}`
            );
            skipCount++;
            continue;
          }
        }

        validVideos.push(videoEntity);
      }

      if (validVideos.length === 0) {
        this.logger.debug(TAG, '没有有效的视频线路需要插入');
        return { successCount: 0, skipCount: videoEntities.length };
      }

      this.logger.info(TAG, `准备插入 ${validVideos.length} 条视频线路`);

      // 批量准备 video_line 数据
      const videoLineData = validVideos.map(videoEntity => ({
        collection_name: collectionEntity.name,
        tag: collectionEntity.param,
        video_id: videoEntity.id,
        video_name: videoEntity.title,
        collection_id: collectionId,
        sort: collectionEntity.sort,
      }));

      // 批量 upsert video_line 记录
      try {
        await this.videoLineEntity.upsert(videoLineData, [
          'collection_id',
          'video_id',
        ]);
      } catch (upsertError) {
        this.logger.error(TAG, '批量 upsert video_line 失败:', upsertError);
        throw upsertError;
      }

      this.logger.info(TAG, 'upsert video_line 完成，开始查询生成的 ID');

      // 批量查询刚插入的 video_line 记录获取 ID
      const videoIds = validVideos.map(v => v.id);

      this.logger.debug(
        TAG,
        `准备查询 video_line，videoIds 数量: ${
          videoIds.length
        }, collection_id: ${collectionId}, 示例 IDs: ${videoIds
          .slice(0, 3)
          .join(', ')}`
      );

      const insertedVideoLines = await this.videoLineEntity.find({
        where: {
          video_id: In(videoIds),
          collection_id: collectionId,
        },
      });

      if (!insertedVideoLines || insertedVideoLines.length === 0) {
        this.logger.error(TAG, '查询 video_line 记录失败，未找到任何记录');
        this.logger.error(
          TAG,
          `调试信息：videoIds=${JSON.stringify(
            videoIds.slice(0, 10)
          )}, collection_id=${collectionId}`
        );
        return { successCount: 0, skipCount: validVideos.length };
      }

      this.logger.info(
        TAG,
        `查询到 ${insertedVideoLines.length} 条 video_line 记录（期望 ${videoIds.length} 条）`
      );

      // 如果查询结果数量不匹配，记录详细日志
      if (insertedVideoLines.length !== videoIds.length) {
        const foundIds = new Set(insertedVideoLines.map(vl => vl.video_id));
        const missingVideos = validVideos.filter(v => !foundIds.has(v.id));

        this.logger.warn(TAG, `有 ${missingVideos.length} 条视频线路查询失败`);

        // 记录前10个失败的 ID
        this.logger.warn(
          TAG,
          `失败的 video_id 示例：${missingVideos
            .slice(0, 10)
            .map(v => v.id)
            .join(', ')}`
        );

        // 尝试单独查询第一个失败的记录，验证是否存在
        if (missingVideos.length > 0) {
          const firstMissing = missingVideos[0];
          const singleCheck = await this.videoLineEntity.findOne({
            where: {
              video_id: firstMissing.id,
              collection_id: collectionId,
            },
          });
          this.logger.warn(
            TAG,
            `单独查询 [${firstMissing.id}] ${firstMissing.title} 结果：${
              singleCheck ? '存在' : '不存在'
            }`
          );
        }
      }

      successCount = insertedVideoLines.length;

      // 构建 videoId -> videoLineId 映射
      // 注意：video_id 在数据库中是 bigint，返回时可能是字符串，需要统一转换为字符串作为键
      const videoLineIdMap = new Map<string, number>();
      insertedVideoLines.forEach(vl => {
        if (vl.video_id && vl.id) {
          // 统一转换为字符串作为 Map 键，避免类型不匹配问题
          videoLineIdMap.set(String(vl.video_id), vl.id);
        }
      });

      this.logger.debug(
        TAG,
        `构建映射完成，map 大小: ${videoLineIdMap.size}, 示例键: ${Array.from(
          videoLineIdMap.keys()
        )
          .slice(0, 3)
          .join(', ')}`
      );

      // 批量准备 play_line 数据
      const allPlayLines: Array<Line> = [];
      let parseErrorCount = 0;
      let missingIdCount = 0;

      for (const videoEntity of validVideos) {
        // 统一转换为字符串查找
        const videoLineEntityId = videoLineIdMap.get(String(videoEntity.id));

        if (!videoLineEntityId) {
          missingIdCount++;
          this.logger.warn(
            TAG,
            `视频 [${videoEntity.id}] ${videoEntity.title} 未找到对应的 video_line ID`
          );
          continue;
        }

        try {
          const playLines = this.parseVideoList(
            videoEntity,
            collectionEntity,
            videoLineEntityId
          );

          if (playLines.length === 0) {
            parseErrorCount++;
            this.logger.warn(
              TAG,
              `视频 [${videoEntity.title}] 没有解析出播放线路`
            );
          }

          allPlayLines.push(...playLines);
        } catch (error) {
          parseErrorCount++;
          this.logger.error(
            TAG,
            `解析视频 [${videoEntity.title}] 播放线路异常:`,
            error
          );
        }
      }

      // 批量插入 play_line 记录
      if (allPlayLines.length > 0) {
        this.logger.info(TAG, `准备插入 ${allPlayLines.length} 条播放线路`);
        await this.playLineService.batchInsert(allPlayLines);
      } else {
        this.logger.warn(TAG, '没有有效的播放线路需要插入');
      }

      if (parseErrorCount > 0) {
        this.logger.warn(
          TAG,
          `批量插入完成：成功 ${successCount} 条，解析失败 ${parseErrorCount} 条，缺失 ID ${missingIdCount} 条`
        );
      } else if (missingIdCount > 0) {
        this.logger.warn(
          TAG,
          `批量插入完成：成功 ${successCount} 条，缺失 ID ${missingIdCount} 条`
        );
      } else {
        this.logger.info(
          TAG,
          `批量插入视频线路完成，成功${successCount}条，跳过${skipCount}条`
        );
      }

      // 批量缓存存在标记
      const cachePromises = validVideos.map(videoEntity =>
        this.midwayCache.set(
          `${cacheKeyPrefix}${videoEntity.id}`,
          true,
          this.CACHE_TTL
        )
      );
      await Promise.all(cachePromises);
    } catch (error) {
      this.logger.error(TAG, '批量插入视频线路异常', error);
      throw error;
    }

    return { successCount, skipCount };
  }

  /**
   * 插入单条视频线路
   */
  async insert(
    videoEntity: VideoEntity,
    collectionEntity: CollectionEntity
  ): Promise<void> {
    if (
      !videoEntity ||
      !videoEntity.id ||
      !collectionEntity ||
      !collectionEntity.id
    ) {
      this.logger.warn(TAG, '插入视频线路参数无效');
      return;
    }

    try {
      const videoId = videoEntity.id;
      const collectionId = collectionEntity.id;

      // 检查缓存中是否已存在该视频线路
      const cacheKey = `videoLine:exists:${videoId}:${collectionId}`;
      const existsInCache = await this.midwayCache.get(cacheKey);

      if (existsInCache) {
        this.logger.debug(TAG, `视频线路已存在，跳过: ${videoEntity.title}`);
        return;
      }

      // 先查再写，兼容部分驱动下 upsert 返回实体 id 为空导致的报错
      const existing = await this.videoLineEntity.findOne({
        where: {
          video_id: videoId,
          collection_id: collectionId,
        },
      });

      const writeData = {
        collection_name: collectionEntity.name,
        tag: collectionEntity.param,
        video_id: videoId,
        video_name: videoEntity.title,
        collection_id: collectionId,
        sort: collectionEntity.sort,
      };

      let videoLineEntityId = existing?.id;

      if (existing && existing.id) {
        await this.videoLineEntity.update(
          {
            id: existing.id,
          },
          writeData
        );
      } else {
        const inserted = await this.videoLineEntity.save(
          writeData as VideoLineEntity
        );
        videoLineEntityId =
          inserted?.id ||
          (
            await this.videoLineEntity.findOne({
              where: {
                video_id: videoId,
                collection_id: collectionId,
              },
            })
          )?.id;
      }

      if (!videoLineEntityId) {
        this.logger.error(
          TAG,
          `无法获取 videoLineEntity id: ${videoEntity.title}`
        );
        return;
      }

      const playLines = this.parseVideoList(
        videoEntity,
        collectionEntity,
        videoLineEntityId
      );

      // 使用 Promise.all 等待所有插入操作完成，确保 video_line_id 正确设置
      await Promise.all(
        playLines.map(item => this.playLineService.insert(item))
      );

      this.logger.info(
        TAG,
        `insert ${videoEntity.title} videoLineEntityId ${videoLineEntityId} success`
      );

      // 缓存存在标记
      await this.midwayCache.set(cacheKey, true, this.CACHE_TTL);
    } catch (error) {
      this.logger.error(TAG, `插入视频线路失败: ${videoEntity?.title}`, error);

      // 更新数据（优化：简化错误处理逻辑）
      const videoId = videoEntity.id;
      const collectionId = collectionEntity.id;
      const cacheKey = `videoLine:exists:${videoId}:${collectionId}`;

      await this.videoLineEntity.update(
        {
          video_id: videoId,
          collection_id: collectionId,
        },
        {
          collection_name: collectionEntity.name,
          tag: collectionEntity.param,
          video_id: videoId,
          video_name: videoEntity.title,
          collection_id: collectionId,
          sort: collectionEntity.sort,
        }
      );

      // 查询获取实际的 videoLineEntity id
      const videoLineEntity = await this.videoLineEntity.findOne({
        where: {
          video_id: videoId,
          collection_id: collectionId,
        },
      });

      if (!videoLineEntity || !videoLineEntity.id) {
        this.logger.error(
          TAG,
          `无法获取 videoLineEntity id: ${videoEntity.title}`
        );
        return;
      }

      const playLines = this.parseVideoList(
        videoEntity,
        collectionEntity,
        videoLineEntity.id
      );

      // 使用 Promise.all 等待所有插入操作完成，确保 video_line_id 正确设置
      await Promise.all(
        playLines.map(item => this.playLineService.insert(item))
      );

      this.logger.info(
        TAG,
        `update ${videoEntity.title} videoLineEntityId ${videoLineEntity.id}  success`
      );

      // 缓存存在标记
      await this.midwayCache.set(cacheKey, true, this.CACHE_TTL);
    }
  }

  /**
   * 更新排序
   */
  updateSort(id: number, sort: number): void {
    if (!id || typeof sort !== 'number') {
      this.logger.warn(TAG, '更新排序参数无效');
      return;
    }

    this.videoLineEntity.update(
      {
        collection_id: id,
      },
      {
        sort: sort,
      }
    );
  }

  /**
   * 批量删除视频线路
   */
  idsDelete(ids: number[] | string[]): void {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      this.logger.warn(TAG, '删除ID数组不能为空');
      return;
    }

    // 将数字转换为字符串以匹配 bigint 类型
    const stringIds = ids.map(id => id.toString());
    this.videoLineEntity.delete({
      video_id: In(stringIds),
    });
  }
}
