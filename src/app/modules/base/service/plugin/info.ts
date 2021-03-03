import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolPlugin } from 'midwayjs-cool-core';

/**
 * 插件
 */
@Provide()
export class BasePluginInfoService extends BaseService {
  @Inject('cool:coolPlugin')
  coolPlugin: CoolPlugin;

  /**
   * 列表
   */
  async list(keyWord) {
    return this.coolPlugin.list(keyWord);
  }

  /**
   * 配置
   */
  async config(namespace: string, config) {
    await this.coolPlugin.setConfig(namespace, config);
  }

  /**
   * 获得配置信息
   * @param namespace
   */
  async getConfig(namespace: string) {
    return await this.coolPlugin.getConfig(namespace);
  }

  /**
   * 是否启用插件
   * @param namespace
   * @param enable
   */
  async enable(namespace: string, enable: number) {
    await this.coolPlugin.enable(namespace, enable);
  }
}
