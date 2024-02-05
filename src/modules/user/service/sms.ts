import { Provide, Config, Inject } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { CacheManager } from '@midwayjs/cache';
import { PluginService } from '../../plugin/service/info';

/**
 * 描述
 */
@Provide()
export class UserSmsService extends BaseService {
  // 获得模块的配置信息
  @Config('module.user.sms')
  config;

  @Inject()
  cacheManager: CacheManager;

  @Inject()
  pluginService: PluginService;

  /**
   * 发送验证码
   * @param phone
   */
  async sendSms(phone) {
    // 随机四位验证码
    const code = _.random(1000, 9999);
    const pluginKey = this.config.pluginKey;
    if (!pluginKey) throw new CoolCommException('未配置短信插件');
    try {
      if (pluginKey == 'sms-tx') {
        await this.pluginService.invoke('sms-tx', 'send', [code], [code]);
      }
      if (pluginKey == 'sms-ali') {
        await this.pluginService.invoke('sms-ali', 'send', [phone], {
          code,
        });
      }
      this.cacheManager.set(`sms:${phone}`, code, this.config.timeout);
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
    const cacheCode = await this.cacheManager.get(`sms:${phone}`);
    if (cacheCode == code) {
      return true;
    }
    return false;
  }
}
