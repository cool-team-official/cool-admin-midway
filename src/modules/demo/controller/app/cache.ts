import { DemoCacheService } from './../../service/cache';
import { Inject, Post, Provide, Get } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { CacheManager } from '@midwayjs/cache';

/**
 * 缓存
 */
@Provide()
@CoolController()
export class AppDemoCacheController extends BaseController {
  @Inject()
  cacheManager: CacheManager;

  @Inject()
  demoCacheService: DemoCacheService;

  /**
   * 设置缓存
   * @returns
   */
  @Post('/set')
  async set() {
    await this.cacheManager.set('a', 1);
    // 缓存10秒
    await this.cacheManager.set('a', 1, {
      ttl: 10,
    });
    return this.ok(await this.cacheManager.get('a'));
  }

  /**
   * 获得缓存
   * @returns
   */
  @Get('/get')
  async get() {
    return this.ok(await this.demoCacheService.get());
  }
}
