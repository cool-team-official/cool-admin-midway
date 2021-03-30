import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { Application } from 'egg';
import * as orm from '@midwayjs/orm';
import * as cool from 'midwayjs-cool-core';
import * as wxpay from 'midwayjs-cool-wxpay';
import * as oss from 'midwayjs-cool-oss';
import * as redis from 'midwayjs-cool-redis';
import * as queue from 'midwayjs-cool-queue';
import * as alipay from 'midwayjs-cool-alipay';
//import * as socket from 'midwayjs-cool-socket';

@Configuration({
  // 注意组件顺序 cool 有依赖orm组件， 所以必须放在，orm组件之后 cool的其他组件必须放在cool 核心组件之后
  imports: [
    // 必须，不可移除， https://typeorm.io  打不开？ https://typeorm.biunav.com/zh/
    orm,
    // 必须，不可移除， cool-admin 官方组件 https://www.cool-js.com
    cool,
    // oss插件，需要到后台配置之后才有用，默认是本地上传
    oss,
    // 将缓存替换成redis
    redis,
    // 队列
    queue,
    // 微信支付
    wxpay,
    // 支付宝支付
    alipay,
    // socket
    //socket
  ],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;
  // 应用启动完成
  async onReady(container?: IMidwayContainer) { }
  // 应用停止
  async onStop() { }
}
