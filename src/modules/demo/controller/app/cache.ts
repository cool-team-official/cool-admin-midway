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

  @Post('/set')
  async set() {
    this.cacheManager.set('a', 1);
    return this.ok(await this.cacheManager.get('a'));
  }

  @Get('/get')
  async get() {
    return this.ok(await this.demoCacheService.get());
  }
}
