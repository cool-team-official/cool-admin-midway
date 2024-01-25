import { IMidwayContext, IMidwayApplication } from '@midwayjs/core';
import { PluginInfo } from '../interface';

/**
 * hook基类
 */
export class BasePluginHook {
  /** 请求上下文，用到此项无法本地调试，需安装到cool-admin中才能调试 */
  ctx: IMidwayContext;
  /** 应用实例，用到此项无法本地调试，需安装到cool-admin中才能调试 */
  app: IMidwayApplication;
  /** 插件信息 */
  pluginInfo: PluginInfo;
  /**
   * 初始化
   */
  async init(
    pluginInfo: PluginInfo,
    ctx?: IMidwayContext,
    app?: IMidwayApplication
  ) {
    this.pluginInfo = pluginInfo;
    this.ctx = ctx;
    this.app = app;
  }
}
