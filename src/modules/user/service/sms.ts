import { Provide, Config, Inject } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { CacheManager } from '@midwayjs/cache';
import { CoolSms } from '@cool-midway/sms';

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
  coolSms: CoolSms;

  /**
   * 发送验证码
   * @param phone
   */
  async sendSms(phone) {
    try {
      const code = await this.coolSms.sendCode(phone);
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
    if (cacheCode === code) {
      return true;
    }
    return false;
  }
}
