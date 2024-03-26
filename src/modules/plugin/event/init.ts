import { CoolEvent, Event } from '@cool-midway/core';
import { Inject } from '@midwayjs/core';
import { PluginCenterService } from '../service/center';

// 插件初始化全局事件
export const GLOBAL_EVENT_PLUGIN_INIT = 'globalPluginInit';
// 插件移除全局事件
export const GLOBAL_EVENT_PLUGIN_REMOVE = 'globalPluginRemove';

/**
 * 接收事件
 */
@CoolEvent()
export class PluginInitEvent {
  @Inject()
  pluginCenterService: PluginCenterService;

  /**
   * 插件初始化事件，某个插件重新初始化
   * @param key
   */
  @Event(GLOBAL_EVENT_PLUGIN_INIT)
  async globalPluginInit(key: string) {
    await this.pluginCenterService.initOne(key);
  }

  /**
   * 插件移除或者关闭事件
   * @param key
   * @param isHook
   */
  @Event(GLOBAL_EVENT_PLUGIN_REMOVE)
  async globalPluginRemove(key: string, isHook: boolean) {
    await this.pluginCenterService.remove(key, isHook);
  }
}
