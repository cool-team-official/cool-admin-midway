import { CoolController, BaseController } from '@cool-midway/core';
import { PluginService } from '../../../plugin/service/info';
import { Get, Inject } from '@midwayjs/core';

/**
 * 插件
 */
@CoolController()
export class OpenDemoPluginController extends BaseController {
  @Inject()
  pluginService: PluginService;

  @Get('/invoke', { summary: '调用插件' })
  async invoke() {
    const plugin = await this.pluginService.getInstance('pay-ali');

    // 获得插件配置
    const config = await plugin['getConfig']();

    // 生成订单号
    const orderNum = plugin['createOrderNum']();

    // 获得支付SDK实例
    const instance = await plugin.getInstance();

    // 调用支付接口
    const result = instance.pageExec('alipay.trade.page.pay', {
      notify_url: config.notifyUrl,
      bizContent: {
        out_trade_no: orderNum,
        total_amount: '0.01',
        subject: '测试',
        product_code: 'FAST_INSTANT_TRADE_PAY',
        body: '测试订单',
        qr_pay_mode: '2',
      },
    });

    console.log(result);

    // 获得插件实例
    // const plugin = await this.pluginService.getInstance('pay-wx');

    // // 获得插件配置
    // const config = await plugin['getConfig']();

    // // 生成订单号
    // const orderNum = plugin['createOrderNum']();

    // // 获得微信支付 SDK 实例
    // const instance = await plugin['getInstance']();

    // // Native，返回的信息可以直接生成二维码，用户扫码支付
    // const params = {
    //   description: '测试',
    //   out_trade_no: orderNum,
    //   notify_url: config.notify_url,
    //   amount: {
    //     total: 1,
    //   },
    //   scene_info: {
    //     payer_client_ip: 'ip',
    //   },
    // };
    // const result = await instance.transactions_native(params);
    // console.log(result);
    return this.ok();
  }
}
