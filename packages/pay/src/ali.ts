import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as cid from '@4a/cid';
import { CoolAliPayConfig } from './interface';
import AlipaySdk from 'alipay-sdk';

/**
 * 支付宝支付
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolAliPay {
  pay: AlipaySdk;

  @Config('cool.pay.ali')
  coolAlipay: CoolAliPayConfig;

  @Init()
  async init() {
    if (this.coolAlipay) this.pay = new AlipaySdk(this.coolAlipay);
  }

  /**
   * 获得支付宝支付SDK实例
   * @returns
   */
  getInstance(): AlipaySdk {
    return this.pay;
  }

  /**
   * 通知验签
   * @param postData {JSON} 服务端的消息内容
   * @param raw {Boolean} 是否使用 raw 内容而非 decode 内容验签
   */
  signVerify(postData: any, raw?: boolean) {
    return this.pay.checkNotifySign(postData, raw);
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
  initPay(config: CoolAliPayConfig) {
    return new AlipaySdk(config);
  }
}
