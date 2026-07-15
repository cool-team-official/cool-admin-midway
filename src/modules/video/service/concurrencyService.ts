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

import {ILogger, Inject, InjectClient, Provide} from '@midwayjs/core';
import {CollectionEntity} from '../entity/collection';
import {VIDEOPARAMS, VideoParams} from '../bean/VideoParams';
import {VideoBean} from '../bean/VideoBean';
import {CollectionCategoryEntity} from '../entity/collection_category';
import {InjectEntityModel} from '@midwayjs/typeorm';
import {Repository} from 'typeorm';
import {VideoEntity} from '../entity/videos';
import {VideosService} from './videos';
import {CoolCommException} from '@cool-midway/core';
import {DictInfoService} from '../../dict/service/info';
import {DictInfoEntity} from '../../dict/entity/info';
import {RedisService} from '@midwayjs/redis';
import {VIDEO_RESPONSE} from '../bean/video_response';
import {NetworkErrorHandler} from './networkErrorHandler';
import {CachingFactory, MidwayCache} from '@midwayjs/cache-manager';
import {CollectionLogService} from './collection_log';

const TAG = 'ConcurrencyService';

@Provide()
export class ConcurrencyService {
  @Inject()
  logger: ILogger;
  
  @InjectEntityModel(CollectionCategoryEntity)
  collectionCategoryEntity: Repository<CollectionCategoryEntity>;

  @InjectEntityModel(VideoEntity)
  videoEntity: Repository<VideoEntity>;

  @Inject()
  videosService: VideosService;

  @Inject()
  dictInfoService: DictInfoService;

  @Inject()
  redisService: RedisService;

  @Inject()
  networkErrorHandler: NetworkErrorHandler;

  @Inject()
  collectionLogService: CollectionLogService;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  private readonly CACHE_TTL = 300; // 缓存时间5分钟
  private readonly NETWORK_TIMEOUT = 30000; // 网络请求超时时间（毫秒）
  private readonly MAX_RETRIES = 500; // 最大处理次数，防止无限循环

  private readonly yieldThreshold = 20;
  private readonly listYieldThreshold = 100;
  private readonly redisPopBatchSize = 40;
  private readonly pageWorkerCount = 2; // 降低并发数，避免被采集源拉黑

  // 请求间隔时间（毫秒），避免请求过于频繁被采集源拉黑
  private readonly requestInterval = 500; // 500ms

  // 单次处理的最大数量，防止长时间阻塞
  private readonly maxProcessPerCall = 200;

  // 单次处理的最大时间，防止长时间阻塞（毫秒）
  private readonly maxProcessTimePerCall = 30000; // 30秒

  /**
   * 从Redis获取采集数据
   */
  async getRedisData(): Promise<any> {
    try {
      const data = await this.redisService.exists('video:collection');
      if (data) {
        const queueData = await this.redisService.lpop('video:collection');
        if (queueData) {
          try {
            return JSON.parse(queueData);
          } catch (parseError) {
            this.logger.error(TAG, 'Redis数据解析失败', parseError);
            return null;
          }
        }
      }
      return null;
    } catch (error) {
      this.logger.error(TAG, 'Redis数据获取失败', error);
      return null;
    }
  }

  /**
   * 从Redis批量获取采集数据，减少队列往返次数
   */
  async getRedisDataBatch(count = this.redisPopBatchSize): Promise<any[]> {
    try {
      const pipeline = this.redisService.pipeline();
      for (let i = 0; i < count; i++) {
        pipeline.lpop('video:collection');
      }

      const queueData = await pipeline.exec();
      const result = [];
      for (const [error, raw] of queueData) {
        if (error) {
          this.logger.error(TAG, 'Redis数据获取失败', error);
          continue;
        }
        if (!raw) {
          continue;
        }
        try {
          result.push(JSON.parse(raw as string));
        } catch (parseError) {
          this.logger.error(TAG, 'Redis数据解析失败', parseError);
        }
      }
      return result;
    } catch (error) {
      this.logger.error(TAG, 'Redis批量数据获取失败', error);
      return [];
    }
  }

  /**
   * 处理Redis中的视频采集数据
   */
  async syncVideoPageList(): Promise<number> {
    try {
      this.logger.debug(TAG, '开始处理Redis中的视频采集数据');

      // 记录开始时间用于超时控制
      const startTime = Date.now();
      let processedCount = 0;

      while (processedCount < this.MAX_RETRIES) {
        // 检查是否超出处理限制
        if (processedCount >= this.maxProcessPerCall ||
          Date.now() - startTime > this.maxProcessTimePerCall) {
          this.logger.info(TAG, `达到单次处理限制，已处理: ${processedCount} 项，用时: ${Date.now() - startTime}ms`);
          break; // 退出循环，让其他任务有机会执行
        }

        const remaining = Math.min(
          this.redisPopBatchSize,
          this.maxProcessPerCall - processedCount,
          this.MAX_RETRIES - processedCount
        );
        const dataList = await this.getRedisDataBatch(remaining);
        if (!dataList.length) {
          if (processedCount === 0) {
            this.logger.debug(TAG, 'Redis中没有可处理的数据');
          } else {
            this.logger.info(TAG, `Redis数据处理完成，共处理${processedCount}条数据`);
          }
          break;
        }

        const batchHandledCount = await this.processRedisDataBatch(
          dataList,
          processedCount
        );
        processedCount += batchHandledCount;

        if (processedCount % this.yieldThreshold === 0) {
          await this.yieldToEventLoop();
        }
      }

      if (processedCount >= this.MAX_RETRIES) {
        this.logger.warn(TAG, `达到最大处理次数${this.MAX_RETRIES}，停止处理`);
      }

      return processedCount;
    } catch (error) {
      this.logger.error(TAG, '处理Redis数据失败', error);
      return 0;
    }
  }

  private async processRedisDataBatch(
    dataList: any[],
    processedOffset: number
  ): Promise<number> {
    let cursor = 0;
    let handledCount = 0;
    const workerCount = Math.min(this.pageWorkerCount, dataList.length);

    const worker = async () => {
      while (cursor < dataList.length) {
        const index = cursor++;
        const data = dataList[index];
        const sequence = processedOffset + index + 1;

        if (!this.validateRedisData(data)) {
          this.logger.warn(TAG, `第${sequence}条数据格式无效，跳过`);
          handledCount++;
          this.releaseRedisData(data);
          continue;
        }

        try {
          this.logger.debug(TAG, `开始处理第${sequence}条数据`);

          // 请求间隔，避免过于频繁被采集源拉黑
          if (handledCount > 0) {
            await new Promise(resolve => setTimeout(resolve, this.requestInterval));
          }

          const pageStart = Date.now();
          const pageParams = new VideoParams(data.videoParams);
          pageParams.setPagecount(Number(data.videoParams?.pagecount || 0));
          data.__pageStart = pageStart;
          const {
            categoryMap,
            areaMap,
            languageMap,
          } = await this.fetchCategoryAndDictData(
            data.collectionEntity as CollectionEntity
          );

          const pageResult = await this.processSinglePage(
            pageParams,
            data.collectionEntity as CollectionEntity,
            categoryMap,
            areaMap,
            languageMap
          );

          await this.recordCollectionLog({
            collectionEntity: data.collectionEntity,
            videoParams: data.videoParams,
            status: pageResult.status,
            duration: Date.now() - pageStart,
            pageCount: pageResult.pagecount,
            pageSize: pageResult.pageSize,
            videoCount: pageResult.videoCount,
            errorMessage: pageResult.errorMessage,
            requestUrl: pageResult.requestUrl,
            taskType: pageResult.taskType,
          });

          this.logger.debug(TAG, `第${sequence}条数据处理完成`);
        } catch (error) {
          this.logger.error(TAG, `处理第${sequence}条数据失败`, error);
          if (data?.collectionEntity && data?.videoParams) {
            const pageParams = new VideoParams(data.videoParams);
            pageParams.setPagecount(Number(data.videoParams?.pagecount || 0));
            await this.recordCollectionLog({
              collectionEntity: data.collectionEntity,
              videoParams: data.videoParams,
              status: 0,
              duration: Date.now() - (data.__pageStart || Date.now()),
              pageCount: pageParams.getPagecount(),
              pageSize: pageParams.getPagesize() || pageParams.getPs() || 0,
              videoCount: 0,
              errorMessage: error?.message || String(error),
              requestUrl: `${data.collectionEntity.address}?${pageParams.getQueryString()}`.replace(/\s+/g, ''),
              taskType: pageParams.getOp() || 'all',
            });
          }
        } finally {
          handledCount++;
          this.releaseRedisData(data);
        }
      }
    };

    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    return handledCount;
  }

  private releaseRedisData(data: any): void {
    if (!data || typeof data !== 'object') {
      return;
    }
    data.collectionEntity = null;
    data.videoParams = null;
  }

  private async processSinglePage(
    item: VideoParams,
    collectionEntity: CollectionEntity,
    categoryMap: Map<
      number,
      { categoryId: number; categoryPid: number }
    >,
    areaMap: Map<string, number>,
    languageMap: Map<string, number>
  ): Promise<{
    status: number;
    pagecount: number;
    pageSize: number;
    videoCount: number;
    errorMessage?: string;
    requestUrl: string;
    taskType: string;
  }> {
    const requestUrl = `${collectionEntity.address}?${item.getQueryString()}`.replace(/\s+/g, '');
    try {
      const result = await this.processSingleVideoItem(item, collectionEntity);
      const videoCount = Array.isArray(result.data?.list) ? result.data.list.length : 0;
      const errorMessage = result.success
        ? ''
        : result.error?.message || '采集失败';

      await this.handleResultsAndSaves(
        result,
        collectionEntity,
        categoryMap,
        areaMap,
        languageMap
      );

      return {
        status: result.success ? 1 : 0,
        pagecount: item.getPagecount(),
        pageSize: item.getPagesize() || item.getPs() || 0,
        videoCount,
        requestUrl,
        taskType: item.getOp() || 'all',
        errorMessage,
      };
    } catch (error) {
      return {
        status: 0,
        pagecount: item.getPagecount(),
        pageSize: item.getPagesize() || item.getPs() || 0,
        videoCount: 0,
        errorMessage: error?.message || String(error),
        requestUrl,
        taskType: item.getOp() || 'all',
      };
    }
  }

  private async recordCollectionLog(data: {
    collectionEntity: CollectionEntity;
    videoParams: VIDEOPARAMS;
    status: number;
    duration: number;
    pageCount: number;
    pageSize: number;
    videoCount: number;
    errorMessage?: string;
    requestUrl: string;
    taskType: string;
  }): Promise<void> {
    try {
      await this.collectionLogService.addLog({
        collection_id: data.collectionEntity?.id,
        collection_name: data.collectionEntity?.name,
        page: data.videoParams?.page ?? data.videoParams?.pg ?? 0,
        pagecount: data.pageCount,
        page_size: data.pageSize,
        video_count: data.videoCount,
        status: data.status,
        duration: data.duration,
        error_message: data.errorMessage || '',
        request_url: data.requestUrl,
        task_type: data.taskType,
      });
    } catch (error) {
      this.logger.error(TAG, '记录采集日志失败', error);
    }
  }

  /**
   * 提取字符串中的数字
   */
  extractNumber(inputString: string): number {
    // 判断inputString是不是一个number 如果是number类型就直接返回
    if (!isNaN(Number(inputString))) {
      return Number(inputString);
    }
    // 使用正则表达式匹配数字
    const regex = /\d+/g;
    const matches = inputString.match(regex);

    // 如果匹配到数字，返回第一个匹配的数字
    if (matches && matches.length > 0) {
      return parseInt(matches[0]);
    }

    // 如果没有匹配到数字，返回 NaN
    return NaN;
  }

  /**
   * 同步视频页面数据
   */
  async syncVideoPage(
    collectionEntity: CollectionEntity,
    params: VideoParams
  ): Promise<VIDEO_RESPONSE | Object> {
    let uri: string = '';

    try {
      if (!collectionEntity || !collectionEntity.address) {
        this.logger.warn(TAG, '集合实体或地址为空');
        return {};
      }

      uri = collectionEntity.address + '?' + params.getQueryString();
      // 删除uri的空格
      uri = uri.replace(/\s+/g, '');
      this.logger.debug(TAG, `请求URL: ${uri}`);

      // 使用网络错误处理器进行请求
      const result = await this.networkErrorHandler.requestWithRetry(
        {
          url: uri,
          method: 'GET',
          timeout: this.NETWORK_TIMEOUT,
          ...this.networkErrorHandler.getCollectionAxiosConfig()
        },
        2, // 最大重试2次（减少重试次数，因为是在循环中）
        1500 // 初始延迟1.5秒
      );

      return result.data;
    } catch (error) {
      // 网络错误详细信息记录
      let errorMessage = 'Unknown error';
      if (this.networkErrorHandler.isNetworkError(error)) {
        errorMessage = this.networkErrorHandler.getNetworkErrorDetails(error);
        this.logger.error(TAG, `网络请求失败: ${errorMessage}`);

        if (this.networkErrorHandler.isDnsError(error) && collectionEntity?.name) {
          this.logger.warn(TAG, `采集源 "${collectionEntity.name}" 域名解析失败，可能需要检查URL配置`);
        }
      } else {
        errorMessage = error.message || error.toString();
        this.logger.error(TAG, `非网络错误: ${errorMessage}`);
      }

      this.logger.info(
        TAG,
        `request error ${uri || 'unknown URL'} - ${errorMessage}`
      );

      throw error;
    }
  }

  /**
   * 保存视频数据
   */
  async saveVideo(videoList: VideoBean[], collectionEntity: CollectionEntity): Promise<void> {
    try {
      if (!videoList || videoList.length === 0) {
        this.logger.warn(TAG, '视频列表为空，跳过保存');
        return;
      }

      this.logger.info(TAG, `开始保存视频数据，共${videoList.length}条`);
      
      // 转换 VideoBean 为 VideoEntity
      const videoEntities: VideoEntity[] = [];
      for (const item of videoList) {
        try {
          const videoEntity = item as unknown as VideoEntity;
          videoEntities.push(videoEntity);
        } catch (error) {
          this.logger.error(TAG, `转换视频数据失败`, error);
        }
      }

      if (videoEntities.length === 0) {
        this.logger.warn(TAG, '没有有效的视频数据需要保存');
        return;
      }

      // 使用批量插入方法
      const result = await this.videosService.batchInsert(videoEntities, collectionEntity);
      
      this.logger.info(TAG, `视频保存完成，成功${result.successCount}条，跳过${result.skipCount}条，失败${result.errorCount}条`);
      
      // 显式清空数组，释放内存
      videoList = null;
      collectionEntity = null;
    } catch (error) {
      this.logger.error(TAG, '批量保存视频数据失败', error);
    }
  }

  /**
   * 验证Redis数据格式
   */
  private validateRedisData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (!data.collectionEntity || !data.videoParams) {
      this.logger.warn(TAG, 'Redis数据缺少必要字段: collectionEntity 或 videoParams');
      return false;
    }

    if (!data.collectionEntity.id || !data.collectionEntity.name) {
      this.logger.warn(TAG, 'collectionEntity缺少必要字段: id 或 name');
      return false;
    }

    return true;
  }

  /**
   * 判断是否为重复键错误
   */
  private isDuplicateKeyError(error: any): boolean {
    return error.code === 'ER_DUP_ENTRY' ||
      error.errno === 1062 ||
      (error.message && error.message.includes('Duplicate entry'));
  }

  /**
   * 获取分类和字典数据（带缓存优化）
   */
  private async fetchCategoryAndDictData(collectionEntity: CollectionEntity): Promise<{
    collectionCategoryEntityList: CollectionCategoryEntity[];
    categoryMap: Map<number, { categoryId: number; categoryPid: number }>;
    areaMap: Map<string, number>;
    languageMap: Map<string, number>;
  }> {
    if (!collectionEntity || !collectionEntity.id) {
      throw new CoolCommException('集合实体或ID为空');
    }

    const collectionId = collectionEntity.id;

    // 优化：使用缓存避免重复查询分类和字典数据
    const cacheKey = `categoryDict:${collectionId}`;
    const cachedData = await this.midwayCache.get(cacheKey);

    if (cachedData) {
      this.logger.debug(TAG, `从缓存获取分类和字典数据: ${collectionId}`);
      return cachedData as {
        collectionCategoryEntityList: CollectionCategoryEntity[];
        categoryMap: Map<number, { categoryId: number; categoryPid: number }>;
        areaMap: Map<string, number>;
        languageMap: Map<string, number>;
      };
    }

    const collectionCategoryEntityList =
      await this.collectionCategoryEntity.findBy({
        collection_id: collectionId,
      });

    const [areaEntityList, languageEntityList] = await Promise.all([
      this.dictInfoService.data(['area']),
      this.dictInfoService.data(['language']),
    ]);

    this.logger.info(TAG, `采集源 "${collectionEntity.name}" 匹配到 ${collectionCategoryEntityList.length} 个分类`);

    if (!collectionCategoryEntityList.length) {
      this.logger.error(TAG, `采集源 "${collectionEntity.name}" (ID: ${collectionEntity.id}) 未匹配系统分类，无法入库`);
      this.logger.error(TAG, '请先在后台管理系统中为该采集源配置分类映射关系');
      throw new CoolCommException(`采集源 "${collectionEntity.name}" 未匹配系统分类，无法入库`);
    }

    const categoryMap = this.buildCategoryMap(collectionCategoryEntityList);
    const areaMap = this.buildDictMap((areaEntityList['area'] ?? []) as DictInfoEntity[]);
    const languageMap = this.buildDictMap((languageEntityList['language'] ?? []) as DictInfoEntity[]);

    const result = {
      collectionCategoryEntityList,
      categoryMap,
      areaMap,
      languageMap,
    };

    // 缓存结果
    await this.midwayCache.set(cacheKey, result, this.CACHE_TTL);
    this.logger.debug(TAG, `分类和字典数据已缓存: ${collectionId}`);

    return result;
  }

  /**
   * 处理视频参数项
   */
  private async processVideoParamsItems(
    item: VideoParams,
    collectionEntity: CollectionEntity,
    categoryMap: Map<
      number,
      { categoryId: number; categoryPid: number }
    >,
    areaMap: Map<string, number>,
    languageMap: Map<string, number>
  ): Promise<void> {
    const result = await this.processSingleVideoItem(item, collectionEntity);
    await this.handleResultsAndSaves(
      result,
      collectionEntity,
      categoryMap,
      areaMap,
      languageMap
    );
  }

  /**
   * 处理单个视频项
   */
  private async processSingleVideoItem(
    item: VideoParams,
    collectionEntity: CollectionEntity
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      const result = await this.syncVideoPage(collectionEntity, item);
      return {success: true, data: result};
    } catch (error) {
      this.logger.error(
        TAG,
        `采集失败 syncVideoPage error: ${error.message}`
      );
      return {success: false, error};
    }
  }

  /**
   * 处理结果并保存
   */
  private async handleResultsAndSaves(
    result: any,
    collectionEntity: CollectionEntity,
    categoryMap: Map<
      number,
      { categoryId: number; categoryPid: number }
    >,
    areaMap: Map<string, number>,
    languageMap: Map<string, number>
  ): Promise<void> {
    if (!result) {
      this.logger.warn(TAG, '无效的API响应结果');
      return;
    }

    const videoList: VideoBean[] = [];
    if (result.success && result.data?.list) {
      this.logger.info(TAG, `开始处理视频列表，共${result.data.list.length}条数据`);

      let processedCount = 0;
      while (result.data.list.length) {
        const item = result.data.list.shift();
        this.processVideoItem(
          item,
          collectionEntity,
          categoryMap,
          areaMap,
          languageMap,
          videoList
        );
        processedCount++;
        if (processedCount % this.listYieldThreshold === 0) {
          await this.yieldToEventLoop();
        }
      }

      // 及时释放 result.data.list 内存
      result.data.list = null;

      this.logger.info(TAG, `视频数据处理完成，处理${processedCount}条，有效${videoList.length}条`);
    } else {
      this.logger.warn(TAG, '无效的视频数据响应', {
        success: result.success,
        hasData: !!result.data,
        hasList: !!result.data?.list,
        listLength: result.data?.list?.length
      });
    }

    if (videoList.length > 0) {
      await this.saveVideo(videoList, collectionEntity);
    } else {
      this.logger.warn(TAG, '没有有效的视频数据需要保存');
    }
  }

  /**
   * 处理多个结果并保存
   */
  private async handleResultsAndSave(
    results: any[],
    collectionEntity: CollectionEntity,
    categoryMap: Map<
      number,
      { categoryId: number; categoryPid: number }
    >,
    areaMap: Map<string, number>,
    languageMap: Map<string, number>
  ): Promise<void> {
    if (!results || !results.length) {
      this.logger.warn(TAG, '结果列表为空');
      return;
    }

    const videoList: VideoBean[] = [];
    while (results.length) {
      const result = results.shift();
      if (result.success && result.data?.list) {
        while (result.data.list.length) {
          const item = result.data.list.shift();
          this.processVideoItem(
            item,
            collectionEntity,
            categoryMap,
            areaMap,
            languageMap,
            videoList
          );
        }
        // 及时释放 result.data.list 内存
        result.data.list = null;
      }
    }
    // 及时释放 results 数组
    results = null;
    
    if (videoList.length > 0) {
      await this.saveVideo(videoList, collectionEntity);
    } else {
      this.logger.warn(TAG, '没有有效的视频数据需要保存');
    }
  }

  /**
   * 处理单个视频项
   */
  private processVideoItem(
    item: any,
    collectionEntity: CollectionEntity,
    categoryMap: Map<number, { categoryId: number; categoryPid: number }>,
    areaMap: Map<string, number>,
    languageMap: Map<string, number>,
    videoList: VideoBean[]
  ): void {
    if (!item) {
      return;
    }

    const category = categoryMap.get(this.safeNumber(item.type_id) ?? -1);
    if (!category) {
      this.logger.warn(TAG, `分类不存在：${item.type_name} ${item.type_id}，跳过该视频: ${item.vod_name || item.name}`);
      return;
    }
    
    item.categoryId = category.categoryId;
    item.categoryPid = category.categoryPid;
    item.collectionName = collectionEntity.name;
    item.collectionId = collectionEntity.id;

    item.language = this.resolveDictId(
      item.vod_lang || item.language || item.lang,
      languageMap,
      611
    );
    item.area = this.resolveDictId(
      item.vod_area || item.area,
      areaMap,
      570
    );

    try {
      const videoBean = new VideoBean(item);
      videoList.push(videoBean);
      this.logger.debug(TAG, `视频数据处理成功: ${item.vod_name || item.name}`);
    } catch (error) {
      this.logger.error(TAG, `创建 VideoBean 失败: ${item.vod_name || item.name}`, error);
    }
  }

  /**
   * 构建分类映射
   */
  private buildCategoryMap(
    collectionCategoryEntityList: CollectionCategoryEntity[]
  ): Map<number, { categoryId: number; categoryPid: number }> {
    const entityById = new Map<number, CollectionCategoryEntity>();
    collectionCategoryEntityList.forEach(item => {
      if (item?.id) {
        entityById.set(item.id, item);
      }
    });

    const categoryMap = new Map<
      number,
      { categoryId: number; categoryPid: number }
    >();

    collectionCategoryEntityList.forEach(item => {
      const classId = item?.class_id;
      if (!classId) {
        return;
      }
      const parentEntity = item.parentId ? entityById.get(item.parentId) : null;
      categoryMap.set(classId, {
        categoryId: item.sys_category_id ?? 0,
        categoryPid: parentEntity?.sys_category_id ?? 0,
      });
    });

    return categoryMap;
  }

  /**
   * 构建字典映射
   */
  private buildDictMap(list: DictInfoEntity[]): Map<string, number> {
    const map = new Map<string, number>();
    list.forEach(item => {
      if (item?.name && item?.id) {
        map.set(item.name, item.id);
      }
    });
    return map;
  }

  /**
   * 解析字典ID
   */
  private resolveDictId(
    value: string,
    map: Map<string, number>,
    fallback: number
  ): number {
    if (!value) {
      return fallback;
    }
    return map.get(value) ?? fallback;
  }

  /**
   * 安全转换为数字
   */
  private safeNumber(value: any): number | null {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.trunc(parsed);
  }

  /**
   * 延迟函数
   */
  private async sleep(ms = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 让出事件循环
   */
  private async yieldToEventLoop(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }
}
