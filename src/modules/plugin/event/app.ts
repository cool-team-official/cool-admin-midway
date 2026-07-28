import { CoolEvent, Event } from '@cool-midway/core';
import { App, Config, ILogger, Inject, Logger } from '@midwayjs/core';
import { IMidwayKoaApplication } from '@midwayjs/koa';
import { PLUGIN_CACHE_KEY, PluginCenterService } from '../service/center';
import { PluginTypesService } from '../service/types';
import { CacheStore } from '@/comm/cache';

/**
 * 插件事件
 */
@CoolEvent()
export class PluginAppEvent {
  @Logger()
  coreLogger: ILogger;

  @Config('module')
  config;

  @App()
  app: IMidwayKoaApplication;

  @Inject()
  cache: CacheStore;

  @Inject()
  pluginCenterService: PluginCenterService;

  @Inject()
  pluginTypesService: PluginTypesService;

  @Event('onServerReady')
  async onServerReady() {
    await this.cache.set(PLUGIN_CACHE_KEY, []);
    this.pluginCenterService.init();
    // this.pluginTypesService.reGenerate();
  }
}
