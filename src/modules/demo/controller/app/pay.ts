import { ALL, App, Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { CoolWxPay, CoolAliPay } from '@cool-midway/pay';
import { parseString } from 'xml2js';
import { Context } from '@midwayjs/koa';
import { IMidwayApplication } from '@midwayjs/core';

/**
 * 支付示例
 */
@Provide()
@CoolController()
export class DemoPayController extends BaseController {
  // 微信支付
  @Inject()
  wxPay: CoolWxPay;

  // 支付宝支付
  @Inject()
  aliPay: CoolAliPay;

  @Inject()
  ctx: Context;

  @App()
  app: IMidwayApplication;

  /**
   * 微信扫码支付
   */
  @Post('/wx')
  async wx() {
    const orderNum = await this.wxPay.createOrderNum();
    const data = await this.wxPay.getInstance().unifiedOrder({
      out_trade_no: orderNum,
      body: '测试微信支付',
      total_fee: 1,
      trade_type: 'NATIVE',
      product_id: 'test001',
    });
    return this.ok(data);
  }

  /**
   * 微信支付通知回调
   */
  @Post('/wxNotify')
  async wxNotify() {
    let data = '';
    this.ctx.req.setEncoding('utf8');
    this.ctx.req.on('data', chunk => {
      data += chunk;
    });
    const results = await new Promise((resolve, reject) => {
      this.ctx.req.on('end', () => {
        parseString(data, { explicitArray: false }, async (err, json) => {
          if (err) {
            return reject('success');
          }
          const checkSign = await this.wxPay.signVerify(json.xml);
          if (checkSign && json.xml.result_code === 'SUCCESS') {
            // 处理业务逻辑
            console.log('微信支付成功', json.xml);
            return resolve(true);
          }
          return resolve(false);
        });
      });
    });
    if (results) {
      this.ctx.body =
        '<xml><return_msg>OK</return_msg><return_code>SUCCESS</return_code></xml>';
    }
  }

  /**
   * 支付宝app支付
   * @returns
   */
  @Post('/alipay')
  async alipay() {
    const orderNum = await this.aliPay.createOrderNum();
    // app支付
    const params = await this.aliPay.getInstance().appPay({
      subject: '测试商品',
      body: '测试商品描述',
      outTradeId: orderNum,
      timeout: '10m',
      amount: '10.00',
      goodsType: '0',
    });
    return this.ok(params);
  }

  /**
   * 支付宝支付回调
   */
  @Post('/aliNotify')
  async aliNotify(@Body(ALL) body: any) {
    const { trade_status, out_trade_no } = body;
    const check = await this.aliPay.signVerify(body);
    if (check && trade_status === 'TRADE_SUCCESS') {
      // 处理逻辑
      console.log('支付宝支付成功', out_trade_no);
    }
    this.ctx.body = 'success';
  }
}
