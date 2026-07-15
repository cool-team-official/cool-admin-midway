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
  ILogger,
  IMidwayApplication,
  Inject,
  InjectClient,
  Provide,
} from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { RedisService } from '@midwayjs/redis';
import { CollectionEntity } from '../entity/collection';
import { CollectionCategoryEntity } from '../entity/collection_category';
import { VIDEOPARAMS, VideoParams } from '../bean/VideoParams';
import { ConcurrencyService } from '../service/concurrencyService';
import { CategoryService } from '../service/categoryService';
import { VideoEntity } from '../entity/videos';
import { VideoLineService } from './videoLine';
import { NetworkErrorHandler } from './networkErrorHandler';
import { PlayLineService } from './play_line';
import { VideoRulesEntity } from '../entity/video_rules';
import { VideosService } from './videos';
import { BaseService } from '../../base/service/base';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

const TAG = 'CollectionService';

@Provide()
export class CollectionService extends BaseService {
  @InjectEntityModel(CollectionEntity)
  collectionEntity: Repository<CollectionEntity>;

  @InjectEntityModel(CollectionCategoryEntity)
  collectionCategoryEntity: Repository<CollectionCategoryEntity>;

  @Inject()
  logger: ILogger;

  @Inject()
  concurrencyService: ConcurrencyService;

  @Inject()
  categoryService: CategoryService;

  @Inject()
  videosService: VideosService;

  @InjectEntityModel(VideoEntity)
  videoEntity: Repository<VideoEntity>;

  @Inject()
  videoLineService: VideoLineService;

  @Inject()
  redisService: RedisService;

  @Inject()
  networkErrorHandler: NetworkErrorHandler;

  @Inject()
  playLineService: PlayLineService;

  @InjectEntityModel(VideoRulesEntity)
  videoRulesEntity: Repository<VideoRulesEntity>;

  @App()
  app: IMidwayApplication;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  private readonly CACHE_TTL = 300; // 缓存时间5分钟
  private readonly REDIS_EXPIRY = 60 * 60 * 2; // Redis过期时间2小时
  private readonly BATCH_PUSH_SIZE = 1000; // Redis批量推送大小
  private readonly BATCH_PROCESS_SIZE = 20; // 批量处理大小
  private readonly MEMORY_THRESHOLD = 300; // 内存使用阈值(MB)

  // 是否正在处理采集队列
  private collectionProcessing = false;

  // 单次处理的最大数量，防止长时间阻塞
  private readonly maxProcessPerBatch = 500;

  // 单次处理的最大时间，防止长时间阻塞（毫秒）
  private readonly maxProcessTimePerBatch = 60000; // 60秒

  /**
   * 处理按天同步视频的业务逻辑
   *
   * @param id - 集合实体的唯一标识符
   *
   * 此方法会根据提供的集合ID查找对应的集合实体，
   * 然后调用syncVideo方法，并传入操作类型'day'和小时数24。
   */
  async day(id: number): Promise<void> {
    const collectionEntity = await this.collectionEntity.findOneBy({ id });
    if (!collectionEntity) {
      this.logger.warn(TAG, `未找到ID为 ${id} 的集合实体`);
      return;
    }
    await this.syncVideo(collectionEntity, {
      op: 'day',
      h: 24,
    });
  }

  async week(id: number): Promise<void> {
    const collectionEntity = await this.collectionEntity.findOneBy({ id });
    if (!collectionEntity) {
      this.logger.warn(TAG, `未找到ID为 ${id} 的集合实体`);
      return;
    }
    await this.syncVideo(collectionEntity, {
      op: 'week',
      h: 24 * 7,
    });
  }

  async asyncKeyWord(keyWord: string[]): Promise<void> {
    if (!keyWord || keyWord.length === 0) {
      this.logger.warn(TAG, '关键词列表为空');
      return;
    }

    const collectionEntityList = await this.collectionEntity.findBy({
      isKeyWord: 1,
    });
    if (collectionEntityList.length === 0) {
      this.logger.warn(TAG, '没有配置关键词采集的集合');
      return;
    }

    // 使用Promise.all并发处理，提高效率
    const promises = keyWord.flatMap(item =>
      collectionEntityList.map(collectionEntity =>
        this.syncVideo(collectionEntity, { wd: item })
      )
    );

    await Promise.all(promises);
  }

  /**
   * 检查视频播放线路的可访问性
   */
  async checkVideoLine(): Promise<void> {
    const cacheKey = 'checkVideoLine:processing';

    // 检查是否有正在进行的检查任务
    const isProcessing = await this.midwayCache.get(cacheKey);
    if (isProcessing) {
      this.logger.debug(TAG, '播放线路检查任务正在进行，跳过本次检查');
      return;
    }

    // 设置处理标记，防止重复执行
    await this.midwayCache.set(cacheKey, true, 600);

    try {
      // 获取需要处理的视频列表
      const find = this.videoEntity.createQueryBuilder();
      find.where('play_url_put_in = :play_url_put_in', { play_url_put_in: 0 });
      const data = await this.entityRenderPage(find, { page: 1, size: 10 });

      // 处理播放线路可访问性检查
      await this.processPlayLinesAccessibility();

      // 处理视频播放线路插入
      await this.processVideoLinesInsert(data.list);
    } catch (error) {
      this.logger.error(TAG, '检查视频线路时发生错误:', error);
    } finally {
      // 清除处理标记
      await this.midwayCache.del(cacheKey);
    }
  }

  /**
   * 处理播放线路可访问性检查
   */
  private async processPlayLinesAccessibility(): Promise<void> {
    let offset = 0;
    let hasMore = true;

    // 批量收集需要更新的ID
    const idsToDisable: number[] = [];
    const idsToEnable: number[] = [];

    while (hasMore) {
      // 分批获取播放线路
      const playLines = await this.playLineService.playLineEntity.find({
        skip: offset,
        take: this.BATCH_PROCESS_SIZE,
      });

      // 如果没有更多数据，结束循环
      if (playLines.length === 0) {
        hasMore = false;
        break;
      }

      // 检查每个播放线路的链接是否可访问
      for (const playLine of playLines) {
        if (playLine.id && playLine.file) {
          await this.checkPlayLineAccessibility(
            playLine,
            idsToDisable,
            idsToEnable
          );
        }
      }

      // 更新偏移量
      offset += this.BATCH_PROCESS_SIZE;

      // 如果返回的数据少于批次大小，说明已经处理完所有数据
      if (playLines.length < this.BATCH_PROCESS_SIZE) {
        hasMore = false;
      }

      // 检查内存使用情况并触发垃圾回收
      await this.checkMemoryUsage();

      // 每批处理完成后添加延迟，减轻系统压力
      await this.sleep(200);
    }

    // 批量更新数据库，减少数据库操作次数
    await this.updatePlayLinesStatus(idsToDisable, idsToEnable);
  }

  /**
   * 检查单个播放线路的可访问性
   */
  private async checkPlayLineAccessibility(
    playLine: any,
    idsToDisable: number[],
    idsToEnable: number[]
  ): Promise<void> {
    try {
      const isAccessible = await this.playLineService.isUrlAccessible(
        playLine.file
      );

      // 根据访问结果收集需要更新的ID
      if (!isAccessible) {
        idsToDisable.push(playLine.id);
      } else {
        idsToEnable.push(playLine.id);
      }
    } catch (error) {
      this.logger.error(
        TAG,
        `检查播放线路 ${playLine.name} 时发生错误:`,
        error
      );
      // 发生错误时也禁用线路
      idsToDisable.push(playLine.id);
    }

    // 每处理一条记录后稍微延迟，避免请求过于频繁
    await this.sleep(50);
  }

  /**
   * 批量更新播放线路状态
   */
  private async updatePlayLinesStatus(
    idsToDisable: number[],
    idsToEnable: number[]
  ): Promise<void> {
    if (idsToDisable.length > 0) {
      await this.playLineService.playLineEntity.update(
        { id: In(idsToDisable) },
        { status: 0 }
      );
      this.logger.warn(
        TAG,
        `批量禁用 ${idsToDisable.length} 条不可访问的播放线路`
      );
    }

    if (idsToEnable.length > 0) {
      await this.playLineService.playLineEntity.update(
        { id: In(idsToEnable) },
        { status: 1 }
      );
      this.logger.info(
        TAG,
        `批量启用 ${idsToEnable.length} 条可访问的播放线路`
      );
    }
  }

  /**
   * 处理视频播放线路插入
   */
  private async processVideoLinesInsert(
    videoEntities: VideoEntity[]
  ): Promise<void> {
    for (const videoEntity of videoEntities) {
      let collectionEntity = await this.collectionEntity.findOneBy({
        id: videoEntity.collection_id,
      });

      // 只有当collectionEntity存在时才执行插入操作
      if (collectionEntity) {
        await this.videoLineService.insert(videoEntity, collectionEntity);
      }

      // 每处理一个视频后稍微延迟
      await this.sleep(10);
    }
  }

  /**
   * 采集资源
   * @param collectionEntity - 集合实体
   * @param params - 采集参数
   */
  async syncVideo(
    collectionEntity: CollectionEntity,
    params: VIDEOPARAMS
  ): Promise<void> {
    if (!collectionEntity || !collectionEntity.address) {
      this.logger.warn(TAG, '集合实体或地址为空');
      return;
    }

    try {
      // 构建请求参数和URL
      const defaultParams = new VideoParams(params ? params : {});
      const requestUrl = `${
        collectionEntity.address
      }?${defaultParams.getQueryString()}`;

      // 使用网络错误处理器进行请求
      const result = await this.networkErrorHandler.requestWithRetry(
        {
          url: requestUrl,
          method: 'GET',
          timeout: 30000, // 添加超时设置
          ...this.networkErrorHandler.getCollectionAxiosConfig(),
        },
        3, // 最大重试3次
        2000 // 初始延迟2秒
      );

      const pagecount: number = result.data.pagecount;
      const limit: number = result.data.limit;
      const total: number = result.data.total;

      // 从 params 中提取参数，保留所有原始参数
      const baseParams: VIDEOPARAMS = params ? { ...params } : {};
      let page = params?.page || 0;

      // 批量收集数据后一次性推送到Redis，大幅提升性能
      const batchData: string[] = [];
      let batchCount = 0;

      // 预先构建基础参数对象，减少对象创建
      const baseVideoParamsObj = {
        ...baseParams,
        ps: limit,
        pagesize: limit,
        limit: limit,
        ac: 'detail',
        total: total,
        pagecount: pagecount,
      };

      for (page; page <= pagecount; page++) {
        // 直接构建参数对象，避免创建VideoParams实例
        const videoParamsObj = {
          ...baseVideoParamsObj,
          page: page,
          pg: page,
        };

        // 批量收集数据，不立即推送
        batchData.push(
          JSON.stringify({
            videoParams: videoParamsObj,
            collectionEntity,
          })
        );

        batchCount++;

        // 达到批次大小时，批量推送到Redis
        if (batchCount >= this.BATCH_PUSH_SIZE) {
          await this.batchPushToRedis(batchData);
          batchData.length = 0;
          batchCount = 0;

          // 检查内存使用情况
          await this.checkMemoryUsage();
        }
      }

      // 推送剩余的数据
      if (batchData.length > 0) {
        await this.batchPushToRedis(batchData);
        batchData.length = 0;
      }

      // 确保设置过期时间
      await this.redisService.expire('video:collection', this.REDIS_EXPIRY);
      await this.startCollection();
    } catch (error) {
      this.handleSyncVideoError(error, collectionEntity);
      throw error;
    }
  }

  /**
   * 批量推送到Redis
   */
  private async batchPushToRedis(batchData: string[]): Promise<void> {
    if (!batchData.length) {
      return;
    }

    await this.redisService.lpush('video:collection', ...batchData);
    await this.redisService.expire('video:collection', this.REDIS_EXPIRY);
  }

  /**
   * 处理同步视频时的错误
   */
  private handleSyncVideoError(
    error: any,
    collectionEntity: CollectionEntity
  ): void {
    if (this.networkErrorHandler.isNetworkError(error)) {
      const errorDetails =
        this.networkErrorHandler.getNetworkErrorDetails(error);
      this.logger.error(TAG, `采集失败 - ${errorDetails}`);

      // 记录采集源状态
      if (this.networkErrorHandler.isDnsError(error) && collectionEntity.name) {
        this.logger.warn(
          TAG,
          `采集源 "${collectionEntity.name}" DNS解析失败，可能需要检查域名状态`
        );
      }
    } else {
      this.logger.error(TAG, `采集异常:`, error);
    }
  }

  /**
   * 开始采集任务
   */
  async startCollection(): Promise<void> {
    await this.triggerCollectionProcessing();
  }

  /**
   * 修改之后的处理逻辑
   * @param data - 修改的数据
   * @param type - 修改类型
   */
  async modifyAfter(
    data: any,
    type: 'delete' | 'update' | 'add'
  ): Promise<void> {
    this.logger.debug(TAG, '插入数据成功');

    switch (type) {
      case 'add':
        await this.handleAddOperation(data);
        break;
      case 'update':
        if (data.id && data.sort !== undefined) {
          this.videoLineService.updateSort(data.id, data.sort);
        }
        break;
      case 'delete':
        // 暂时不需要处理删除操作
        break;
    }
  }

  /**
   * 处理添加操作
   */
  private async handleAddOperation(data: any): Promise<void> {
    try {
      if (data.id) {
        const fields = await this.videosService.getVideoEntityFields();
        await this.videoRulesEntity.insert({
          collection_id: data.id,
          sort: 0,
          updateRules: fields.map(item => item.value ?? ''),
        });

        // 检查内存使用情况
        await this.checkMemoryUsage();
      }
    } catch (error) {
      this.logger.error(TAG, 'modifyAfter方法执行失败:', error);

      // 发生错误时也尝试触发垃圾回收
      if (global.gc) {
        global.gc();
      }
    }
  }

  /**
   * 检查内存使用情况并在需要时触发垃圾回收
   */
  private async checkMemoryUsage(): Promise<void> {
    if (global.gc) {
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      if (used > this.MEMORY_THRESHOLD) {
        this.logger.info(
          TAG,
          `当前内存使用 ${used.toFixed(2)} MB，触发垃圾回收`
        );
        global.gc();

        // 短暂延迟让GC完成
        await this.sleep(100);
      }
    }
  }

  /**
   * 延迟函数
   */
  private async sleep(ms = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 检查是否有采集任务，如有则在后台处理
   */
  private async triggerCollectionProcessing(): Promise<void> {
    try {
      const hasData = await this.redisService.exists('video:collection');
      if (hasData) {
        this.logger.info(TAG, '检测到采集任务，准备后台处理');
        this.scheduleBackgroundCollection();
      } else {
        this.logger.debug(TAG, 'Redis中没有采集任务');
      }
    } catch (error) {
      this.logger.error(TAG, '检测采集任务失败', error);
      if (global.gc) {
        global.gc();
      }
    }
  }

  /**
   * 将采集业务放入后台线程执行，避免阻塞请求处理
   */
  private scheduleBackgroundCollection(): void {
    if (this.collectionProcessing) {
      this.logger.debug(TAG, '采集后台任务正在执行，跳过本次调度');
      return;
    }
    this.collectionProcessing = true;

    const runner = this.app as unknown as {
      runInBackground?: (fn: () => Promise<void>) => void;
    };
    const runBackground =
      typeof runner?.runInBackground === 'function'
        ? runner.runInBackground.bind(runner)
        : (fn: () => Promise<void>) => setImmediate(fn);

    runBackground(async () => {
      try {
        this.logger.info(TAG, '后台采集任务开始执行');

        // 记录开始时间用于超时控制
        const startTime = Date.now();
        let processedCount = 0;

        // 循环处理，但限制单次处理的数量和时间
        while (await this.redisService.exists('video:collection')) {
          // 检查是否超出处理限制
          if (
            processedCount >= this.maxProcessPerBatch ||
            Date.now() - startTime > this.maxProcessTimePerBatch
          ) {
            this.logger.info(
              TAG,
              `达到单次处理限制，已处理: ${processedCount} 项，用时: ${
                Date.now() - startTime
              }ms`
            );

            // 短暂延迟后重新调度，让其他任务有机会执行
            setTimeout(() => {
              this.triggerCollectionProcessing();
            }, 1000); // 1秒后重新检查

            return; // 结束当前处理函数
          }

          const handledCount =
            await this.concurrencyService.syncVideoPageList();
          if (handledCount === 0) {
            break;
          }
          processedCount += handledCount;
        }

        // 检查内存使用情况
        await this.checkMemoryUsage();
      } catch (error) {
        this.logger.error(TAG, '后台采集任务异常', error);
      } finally {
        this.collectionProcessing = false;
      }
    });
  }
}
