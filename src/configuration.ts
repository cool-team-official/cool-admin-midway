import * as orm from '@midwayjs/typeorm';
import { Configuration, App, Config, Inject } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as view from '@midwayjs/view-ejs';
import * as staticFile from '@midwayjs/static-file';
import * as localTask from '@midwayjs/task';
// import * as crossDomain from '@midwayjs/cross-domain';
import * as cool from '@cool-midway/core';
import * as cloud from '@cool-midway/cloud';
import * as file from '@cool-midway/file';
import * as sms from '@cool-midway/sms';
import { ILogger } from '@midwayjs/logger';
// import * as rpc from '@cool-midway/rpc';
// import * as task from '@cool-midway/task';
// import * as pay from '@cool-midway/pay';
// import * as iot from '@cool-midway/iot';

@Configuration({
  imports: [
    // https://koajs.com/
    koa,
    // 是否开启跨域(注：顺序不能乱放！！！) http://www.midwayjs.org/docs/extensions/cross_domain
    // crossDomain,
    // 模板渲染 https://midwayjs.org/docs/extensions/render
    view,
    // 静态文件托管 https://midwayjs.org/docs/extensions/static_file
    staticFile,
    // orm https://midwayjs.org/docs/extensions/orm
    orm,
    // 参数验证 https://midwayjs.org/docs/extensions/validate
    validate,
    // 本地任务 http://midwayjs.org/docs/legacy/task
    localTask,
    // cool-admin 官方组件 https://cool-js.com
    cool,
    // 文件上传 本地 阿里云存储 腾讯云存储 七牛云存储
    file,
    // rpc 微服务 远程调用
    // rpc,
    // 任务与队列
    // task,
    // cool-admin 云开发组件
    cloud,
    // 支付(微信、支付宝) https://cool-js.com/admin/node/core/pay.html
    // pay,
    // 物联网开发，如MQTT支持等
    // iot,
    // 短信
    sms,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  @Inject()
  logger: ILogger;

  @Config('module')
  config;

  async onReady() {}
}
