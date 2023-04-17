import { Body, Config, Inject, Post, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolWxPayConfig,
  CoolAliPayConfig,
} from '@cool-midway/core';
import { CoolAliPay, CoolWxPay } from '@cool-midway/pay';
// @ts-ignore
import AlipayFormData from 'alipay-sdk/lib/form';
// @ts-ignore
import { sign } from 'alipay-sdk/lib/util';

/**
 * 微信支付
 */
@Provide()
@CoolController()
export class AppDemoPayController extends BaseController {
  // 微信支付
  @Inject()
  wxPay: CoolWxPay;

  // 支付宝支付
  @Inject()
  aliPay: CoolAliPay;

  @Inject()
  ctx;

  @Config('cool.pay.wx')
  wxPayConfig: CoolWxPayConfig;

  @Config('cool.pay.ali')
  aliPayConfig: CoolAliPayConfig;

  /**
   * 微信扫码支付
   */
  @Post('/wx')
  async wx() {
    const orderNum = await this.wxPay.createOrderNum();
    const params = {
      description: '测试',
      out_trade_no: orderNum,
      notify_url: this.wxPayConfig.notify_url,
      amount: {
        total: 1,
      },
      scene_info: {
        payer_client_ip: 'ip',
      },
    };
    const result = await this.wxPay.getInstance().transactions_native(params);
    return this.ok(result);
  }

  /**
   * 微信支付回调通知
   */
  @Post('/wxNotify')
  async wxNotify(@Body() body) {
    const check = await this.wxPay.signVerify(this.ctx);
    // 验签通过，处理业务逻辑
    if (check) {
    }
  }

  /**
   * 支付宝PC网站支付
   * @returns
   */
  @Post('/aliPc')
  async aliPc() {
    const orderNum = await this.aliPay.createOrderNum();
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    formData.addField('notifyUrl', this.aliPayConfig.notifyUrl);
    formData.addField('bizContent', {
      outTradeNo: orderNum,
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: '0.01',
      subject: '商品',
      body: '商品详情',
    });
    // 返回支付链接
    const result = await this.aliPay
      .getInstance()
      .exec('alipay.trade.page.pay', {}, { formData });
    return this.ok(result);
  }

  /**
   * 支付宝APP支付
   * @returns
   */
  @Post('/aliApp')
  async aliApp() {
    const orderNum = await this.aliPay.createOrderNum();

    // 返回支付链接
    const data = sign(
      'alipay.trade.app.pay',
      {
        notifyUrl: this.aliPayConfig.notifyUrl,
        bizContent: {
          subject: '商品标题',
          totalAmount: '0.01',
          outTradeNo: orderNum,
          productCode: 'QUICK_MSECURITY_PAY',
        },
      },
      this.aliPay.getInstance().config
    );
    const payInfo = new URLSearchParams(data).toString();
    return this.ok(payInfo);
  }

  /**
   * 支付宝支付回调通知
   */
  @Post('/aliNotify')
  async aliNotify(@Body() body) {
    const { ciphertext, associated_data, nonce } = body.resource;
    // 解密数据
    const data = this.wxPay
      .getInstance()
      .decipher_gcm(ciphertext, associated_data, nonce);
    console.log(data);
    const check = await this.aliPay.signVerify(body);
    // 验签通过，处理业务逻辑
    if (check) {
    }
    return 'success';
  }
}
