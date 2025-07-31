import { DemoCacheService } from '../../service/cache';
import { Get, Inject, Post } from '@midwayjs/core';
import { BaseController, CoolController } from '@cool-midway/core';
import { CacheStore } from '@/comm/cache';

/**
 * 缓存
 */
@CoolController()
export class OpenDemoCacheController extends BaseController {
  @Inject()
  cache: CacheStore;

  @Inject()
  demoCacheService: DemoCacheService;

  /**
   * 设置缓存
   * @returns
   */
  @Post('/set', { summary: '设置缓存' })
  async set() {
    await this.cache.set('a', 1);
    // 缓存10秒
    await this.cache.set('a', 1, 10 * 1000);
    return this.ok(await this.cache.get('a'));
  }

  /**
   * 获得缓存
   * @returns
   */
  @Get('/get', { summary: '获得缓存' })
  async get() {
    return this.ok(await this.demoCacheService.get());
  }
}
