import { CoolCommException } from '@cool-midway/core';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as cid from '@4a/cid';
import { CoolWxPayConfig } from './interface';
import WxPay = require('wechatpay-node-v3');

/**
 * 微信支付
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolWxPay {
  pay: WxPay;

  @Config('cool.pay.wx')
  coolWxPay: CoolWxPayConfig;

  @Init()
  async init() {
    if (this.coolWxPay) this.pay = new WxPay(this.coolWxPay);
  }

  /**
   * 获得微信支付SDK实例
   * @returns
   */
  getInstance(): WxPay {
    return this.pay;
  }

  /**
   * 签名
   * @param params
   * @returns
   */
  async signVerify(ctx) {
    if (!this.coolWxPay.key) {
      throw new CoolCommException('未配置key(v3 API密钥)');
    }
    const params = {
      apiSecret: this.coolWxPay.key, // 如果在构造中传入了 key, 这里可以不传该值，否则需要传入该值
      body: ctx.request.body, // 请求体 body
      signature: ctx.headers['wechatpay-signature'],
      serial: ctx.headers['wechatpay-serial'],
      nonce: ctx.headers['wechatpay-nonce'],
      timestamp: ctx.headers['wechatpay-timestamp'],
    };
    return await this.pay.verifySign(params);
  }

  /**
   * 创建订单
   * @param length 订单长度
   * @returns
   */
  createOrderNum(length = 26) {
    return cid(length);
  }

  /**
   * 动态配置支付参数
   * @param config 微信配置
   * @returns
   */
  initPay(config: CoolWxPayConfig) {
    return new WxPay(config);
  }
}
