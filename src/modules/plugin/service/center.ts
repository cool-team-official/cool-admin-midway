import { Provide } from '@midwayjs/decorator';
import {
  App,
  IMidwayApplication,
  Init,
  Inject,
  InjectClient,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { PluginInfoEntity } from '../entity/info';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PluginInfo } from '../interface';
import * as _ from 'lodash';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { CoolEventManager } from '@cool-midway/core';

export const PLUGIN_CACHE_KEY = 'plugin:init';

export const EVENT_PLUGIN_READY = 'EVENT_PLUGIN_READY';

/**
 * 插件中心
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class PluginCenterService {
  // 插件列表
  plugins: Map<string, any> = new Map();

  // 插件配置
  pluginInfos: Map<string, PluginInfo> = new Map();

  @App()
  app: IMidwayApplication;

  @InjectEntityModel(PluginInfoEntity)
  pluginInfoEntity: Repository<PluginInfoEntity>;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Inject()
  coolEventManager: CoolEventManager;

  /**
   * 初始化
   * @returns
   */
  async init() {
    const inits: any[] = (await this.midwayCache.get(PLUGIN_CACHE_KEY)) || [];
    const pid = process.pid;
    if (inits.includes(pid)) return;
    this.plugins.clear();
    await this.initHooks();
    await this.initPlugin();
    await this.midwayCache.set(PLUGIN_CACHE_KEY, inits.concat([process.pid]));
    this.coolEventManager.emit(EVENT_PLUGIN_READY);
  }

  /**
   * 注册插件
   * @param key
   * @param cls
   */
  async register(key: string, cls: any) {
    this.plugins.set(key, cls);
  }

  /**
   * 初始化钩子
   */
  async initHooks() {
    const hooksPath = path.join(
      this.app.getBaseDir(),
      'modules',
      'plugin',
      'hooks'
    );
    for (const key of fs.readdirSync(hooksPath)) {
      const stat = fs.statSync(path.join(hooksPath, key));
      if (!stat.isDirectory()) {
        continue;
      }
      const { Plugin } = await import(path.join(hooksPath, key, 'index'));
      await this.register(key, Plugin);
      this.pluginInfos.set(key, {
        name: key,
        config: this.app.getConfig('module.plugin.hooks.' + key),
      });
    }
  }

  /**
   * 初始化插件
   */
  async initPlugin(hook?: string) {
    const find: any = { status: 1 };
    if (hook) {
      find.hook = hook;
    }
    const plugins = await this.pluginInfoEntity.findBy(find);
    for (const plugin of plugins) {
      const instance = await this.getInstance(plugin.content.data);
      if (plugin.hook) {
        this.pluginInfos.set(plugin.hook, {
          ...plugin.pluginJson,
          config: this.getConfig(plugin.config),
        });
        await this.register(plugin.hook, instance);
      } else {
        this.pluginInfos.set(plugin.keyName, {
          ...plugin.pluginJson,
          config: this.getConfig(plugin.config),
        });
        await this.register(plugin.keyName, instance);
      }
    }
  }

  /**
   * 获得配置
   * @param config
   * @returns
   */
  private getConfig(config: any) {
    const env = this.app.getEnv();
    let isMulti = false;
    for (const key in config) {
      if (key.includes('@')) {
        isMulti = true;
        break;
      }
    }
    return isMulti ? config[`@${env}`] : config;
  }

  /**
   * 获得实例
   * @param content
   * @returns
   */
  async getInstance(content: string) {
    let _instance;
    const script = `
        ${content} 
        _instance = Plugin;
    `;
    eval(script);
    return _instance;
  }
}
