import { App, Inject, Provide } from '@midwayjs/decorator';
import {
  BaseService,
  CoolCommException,
  CoolEventManager,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Not, Repository } from 'typeorm';
import { PluginInfoEntity } from '../entity/info';
import {
  Config,
  IMidwayApplication,
  IMidwayContext,
  InjectClient,
} from '@midwayjs/core';
import * as _ from 'lodash';
import { PluginInfo } from '../interface';
import { PluginCenterService } from './center';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import {
  GLOBAL_EVENT_PLUGIN_INIT,
  GLOBAL_EVENT_PLUGIN_REMOVE,
} from '../event/init';

/**
 * 插件信息
 */
@Provide()
export class PluginService extends BaseService {
  @InjectEntityModel(PluginInfoEntity)
  pluginInfoEntity: Repository<PluginInfoEntity>;

  @Inject()
  ctx: IMidwayContext;

  @App()
  app: IMidwayApplication;

  @Inject()
  pluginCenterService: PluginCenterService;

  @Config('module.plugin.hooks')
  hooksConfig;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Inject()
  coolEventManager: CoolEventManager;

  /**
   * 新增或更新
   * @param param
   * @param type
   */
  async addOrUpdate(param: any, type?: 'add' | 'update') {
    await super.addOrUpdate(param, type);
    const info = await this.pluginInfoEntity.findOneBy({ id: param.id });
    if (info.status == 1) {
      await this.reInit(info.keyName);
    } else {
      await this.remove(info.keyName, !!info.hook);
    }
  }

  /**
   * 重新初始化插件
   */
  async reInit(keyName: string) {
    // 多进程发送全局事件，pm2下生效，本地开发则通过普通事件
    this.coolEventManager.globalEmit(GLOBAL_EVENT_PLUGIN_INIT, false, keyName);
  }

  /**
   * 移除插件
   * @param keyName
   * @param isHook
   */
  async remove(keyName: string, isHook = false) {
    // 多进程发送全局事件，pm2下生效
    this.coolEventManager.globalEmit(
      GLOBAL_EVENT_PLUGIN_REMOVE,
      false,
      keyName,
      isHook
    );
  }

  /**
   * 删除不经过回收站
   * @param ids
   */
  async delete(ids: any) {
    const list = await this.pluginInfoEntity.findBy({ id: In(ids) });
    for (const item of list) {
      await this.remove(item.keyName, !!item.hook);
    }
    await this.pluginInfoEntity.delete(ids);
  }

  /**
   * 更新
   * @param param
   */
  async update(param: any) {
    const old = await this.pluginInfoEntity.findOneBy({ id: param.id });
    // 启用插件，禁用同名插件
    if (old.hook && param.status == 1 && old.status != param.status) {
      await this.pluginInfoEntity.update(
        { hook: old.hook, status: 1, id: Not(old.id) },
        { status: 0 }
      );
    }
    await super.update(param);
  }

  /**
   * 获得插件配置
   * @param key
   */
  async getConfig(key: string) {
    return this.pluginCenterService.pluginInfos.get(key)?.config;
  }

  /**
   * 调用插件
   * @param key 插件key
   * @param method 方法
   * @param params 参数
   * @returns
   */
  async invoke(key: string, method: string, ...params) {
    // 实例
    const instance = await this.getInstance(key);
    return await instance[method](...params);
  }

  /**
   * 获得插件实例
   * @param key
   * @returns
   */
  async getInstance(key: string) {
    const check = await this.checkStatus(key);
    if (!check) throw new CoolCommException(`插件[${key}]不存在或已禁用`);
    let instance;
    const pluginInfo = this.pluginCenterService.pluginInfos.get(key);
    if (pluginInfo.singleton) {
      instance = this.pluginCenterService.plugins.get(key);
    } else {
      instance = new (await this.pluginCenterService.plugins.get(key))();
    }
    await instance.init(pluginInfo, this.ctx, this.app, {
      cache: this.midwayCache,
      pluginService: this,
    });
    return instance;
  }

  /**
   * 检查状态
   * @param key
   */
  async checkStatus(key: string) {
    if (Object.keys(this.hooksConfig).includes(key)) {
      return true;
    }
    const info = await this.pluginInfoEntity
      .createQueryBuilder('a')
      .where({ status: 1, keyName: Equal(key) })
      .getOne();

    return !!info;
  }

  /**
   * 检查
   * @param filePath
   */
  async check(filePath: string) {
    let data;
    try {
      data = await this.data(filePath);
    } catch (e) {
      return {
        type: 0,
        message: `插件信息不完整，请检查${data.errorData}`,
      };
    }
    const check = await this.pluginInfoEntity.findOneBy({
      keyName: data.pluginJson.key,
    });
    if (check && !check.hook) {
      return {
        type: 1,
        message: '插件已存在，继续安装将覆盖',
      };
    }
    if (check && check.hook && check.status == 1) {
      return {
        type: 2,
        message:
          '已存在同名Hook插件，你可以继续安装，但是多个相同的Hook插件只能同时开启一个',
      };
    }
    return {
      type: 3,
      message: '检查通过',
    };
  }

  /**
   * 获得插件数据
   * @param filePath
   */
  async data(filePath: string): Promise<{
    pluginJson: any;
    readme: string;
    logo: string;
    content: string;
    errorData: string;
  }> {
    // const plugin = await download(encodeURI(url));
    const decompress = require('decompress');
    const files = await decompress(filePath);
    let errorData;
    let pluginJson: PluginInfo, readme: string, logo: string, content: string;
    try {
      errorData = 'plugin.json';
      pluginJson = JSON.parse(
        _.find(files, { path: 'plugin.json', type: 'file' }).data.toString()
      );
      errorData = 'readme';
      readme = _.find(files, {
        path: pluginJson.readme,
        type: 'file',
      }).data.toString();
      errorData = 'logo';
      logo = _.find(files, {
        path: pluginJson.logo,
        type: 'file',
      }).data.toString('base64');
      content = _.find(files, {
        path: 'src/index.js',
        type: 'file',
      }).data.toString();
    } catch (e) {
      throw new CoolCommException('插件信息不完整');
    }
    return {
      pluginJson,
      readme,
      logo,
      content,
      errorData,
    };
  }

  /**
   * 安装插件
   * @param file 文件
   * @param force 是否强制安装
   */
  async install(filePath: string, force = false) {
    const forceBool = typeof force === 'string' ? force === 'true' : force;
    const checkResult = await this.check(filePath);
    if (checkResult.type != 3 && !forceBool) {
      return checkResult;
    }
    const { pluginJson, readme, logo, content } = await this.data(filePath);
    const check = await this.pluginInfoEntity.findOneBy({
      keyName: pluginJson.key,
    });
    const data = {
      name: pluginJson.name,
      keyName: pluginJson.key,
      version: pluginJson.version,
      author: pluginJson.author,
      hook: pluginJson.hook,
      readme,
      logo,
      content: {
        type: 'comm',
        data: content,
      },
      description: pluginJson.description,
      pluginJson,
      config: pluginJson.config,
      status: 1,
    } as PluginInfoEntity;
    // 存在同名插件，更新，保留配置
    if (check) {
      await this.pluginInfoEntity.update(check.id, {
        ...data,
        status: check.status,
        config: {
          ...pluginJson.config,
          ...check.config,
        },
      });
    } else {
      // 全新安装
      await this.pluginInfoEntity.insert(data);
    }
    // 初始化插件
    await this.reInit(pluginJson.key);
  }
}
