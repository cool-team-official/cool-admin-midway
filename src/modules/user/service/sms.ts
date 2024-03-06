import {
  Provide,
  Config,
  Inject,
  Init,
  InjectClient,
} from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { PluginService } from '../../plugin/service/info';

/**
 * 描述
 */
@Provide()
export class UserSmsService extends BaseService {
  // 获得模块的配置信息
  @Config('module.user.sms')
  config;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Inject()
  pluginService: PluginService;

  plugin;

  @Init()
  async init() {
    for (const key of ['sms-tx', 'sms-ali']) {
      try {
        this.plugin = await this.pluginService.getInstance(key);
        if (this.plugin) {
          this.config.pluginKey = key;
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  /**
   * 发送验证码
   * @param phone
   */
  async sendSms(phone) {
    // 随机四位验证码
    const code = _.random(1000, 9999);
    const pluginKey = this.config.pluginKey;
    if (!this.plugin) throw new CoolCommException('未配置短信插件');
    try {
      if (pluginKey == 'sms-tx') {
        await this.plugin.send([phone], [code]);
      }
      if (pluginKey == 'sms-ali') {
        await this.plugin.send([phone], {
          code,
        });
      }
      this.midwayCache.set(`sms:${phone}`, code, this.config.timeout * 1000);
    } catch (error) {
      throw new CoolCommException('发送过于频繁，请稍后再试');
    }
  }

  /**
   * 验证验证码
   * @param phone
   * @param code
   * @returns
   */
  async checkCode(phone, code) {
    const cacheCode = await this.midwayCache.get(`sms:${phone}`);
    if (cacheCode == code) {
      return true;
    }
    return false;
  }
}
