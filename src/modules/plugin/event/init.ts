import { CoolEvent, Event } from '@cool-midway/core';
import { Inject } from '@midwayjs/core';
import { PluginService } from '../service/info';

// 插件初始化全局事件
export const GLOBAL_EVENT_PLUGIN_INIT = 'globalPluginInit';

/**
 * 接收事件
 */
@CoolEvent()
export class PluginInitEvent {
  @Inject()
  pluginService: PluginService;

  @Event(GLOBAL_EVENT_PLUGIN_INIT)
  async globalPluginInit() {
    await this.pluginService.reInit();
  }
}
