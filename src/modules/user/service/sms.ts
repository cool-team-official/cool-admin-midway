import { Provide, Config, Inject } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import * as Core from '@alicloud/pop-core';
import { CacheManager } from '@midwayjs/cache';

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

  /**
   * 发送验证码
   * @param phone
   */
  async sendSms(phone) {
    try {
      const TemplateParam = { code: _.random(1000, 9999) };
      await this.send(phone, TemplateParam);
      this.cacheManager.set(
        `sms:${phone}`,
        TemplateParam.code,
        this.config.timeout
      );
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

  /**
   * 发送短信
   * @param phone
   * @param templateCode
   * @param template
   */
  async send(phone, TemplateParam) {
    const { signName, accessKeyId, accessKeySecret, templateCode } =
      this.config;
    const client = new Core({
      accessKeyId,
      accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      // endpoint: 'https://cs.cn-hangzhou.aliyuncs.com',
      apiVersion: '2017-05-25',
      // apiVersion: '2018-04-18',
    });
    const params = {
      RegionId: 'cn-shanghai',
      PhoneNumbers: phone,
      signName,
      templateCode,
      TemplateParam: JSON.stringify(TemplateParam),
    };
    return await client.request('SendSms', params, {
      method: 'POST',
    });
  }
}
