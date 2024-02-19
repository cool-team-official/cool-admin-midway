import { CoolEvent, Event } from '@cool-midway/core';
import { App, Config, ILogger, Inject, Logger } from '@midwayjs/core';
import { IMidwayKoaApplication } from '@midwayjs/koa';
import { PLUGIN_CACHE_KEY, PluginCenterService } from '../service/center';
import { CacheManager } from '@midwayjs/cache';

/**
 * 修改jwt.secret
 */
@CoolEvent()
export class BaseAppEvent {
  @Logger()
  coreLogger: ILogger;

  @Config('module')
  config;

  @App()
  app: IMidwayKoaApplication;

  @Inject()
  cacheManager: CacheManager;

  @Event('onServerReady')
  async onServerReady() {
    await this.cacheManager.set(PLUGIN_CACHE_KEY, []);
    this.app.getApplicationContext().getAsync(PluginCenterService);
  }
}
