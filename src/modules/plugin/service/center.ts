/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import {
  App,
  IMidwayApplication,
  Inject,
  InjectClient,
  Scope,
  Provide,
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
import { PluginService } from './info';

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

  @Inject()
  pluginService: PluginService;

  /**
   * 初始化
   * @returns
   */
  async init() {
    this.plugins.clear();
    await this.initHooks();
    await this.initPlugin();
    this.coolEventManager.emit(EVENT_PLUGIN_READY);
  }

  /**
   * 初始化一个
   * @param keyName key名
   */
  async initOne(keyName: string) {
    await this.initPlugin({
      keyName,
    });
    this.coolEventManager.emit(EVENT_PLUGIN_READY, keyName);
  }

  /**
   * 移除插件
   * @param keyName
   * @param isHook
   */
  async remove(keyName: string, isHook = false) {
    this.plugins.delete(keyName);
    this.pluginInfos.delete(keyName);
    if (isHook) {
      await this.initHooks();
    }
  }

  /**
   * 注册插件
   * @param key 唯一标识
   * @param cls 类
   * @param pluginInfo 插件信息
   */
  async register(key: string, cls: any, pluginInfo?: PluginInfo) {
    // 单例插件
    if (pluginInfo?.singleton) {
      const instance = new cls();
      await instance.init(this.pluginInfos.get(key), null, this.app, {
        cache: this.midwayCache,
        pluginService: this.pluginService,
      });
      this.plugins.set(key, instance);
    } else {
      // 普通插件
      this.plugins.set(key, cls);
    }
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
   * @param condition 插件条件
   */
  async initPlugin(condition?: {
    hook?: string;
    id?: number;
    keyName?: string;
  }) {
    let find: any = { status: 1 };
    if (condition) {
      find = {
        ...find,
        ...condition,
      };
    }
    const plugins = await this.pluginInfoEntity.find({
      where: find,
      select: [
        'id',
        'name',
        'description',
        'keyName',
        'hook',
        'version',
        'pluginJson',
        'config',
      ],
    });
    for (const plugin of plugins) {
      const data = await this.pluginService.getData(plugin.keyName);
      if (!data) {
        continue;
      }
      const instance = await this.getInstance(data.content.data);
      const pluginInfo = {
        ...plugin.pluginJson,
        config: this.getConfig(plugin.config),
      };
      if (plugin.hook) {
        this.pluginInfos.set(plugin.hook, pluginInfo);
        await this.register(plugin.hook, instance, pluginInfo);
      } else {
        this.pluginInfos.set(plugin.keyName, pluginInfo);
        await this.register(plugin.keyName, instance, pluginInfo);
      }
    }
  }

  /**
   * 获得配置
   * @param config
   * @returns
   */
  private getConfig(config: any) {
    // 处理配置为字符串的情况
    if (typeof config === 'string') {
      try {
        config = JSON.parse(config);
      } catch (e) {
        return {};
      }
    }
    // 如果配置为空或非对象类型，则返回空对象
    if (!config || typeof config !== 'object') {
      return {};
    }
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
