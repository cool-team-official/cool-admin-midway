import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as staticFile from '@midwayjs/static-file';
import * as view from '@midwayjs/view-ejs';
import * as orm from '@midwayjs/orm';
import * as cool from '@cool-midway/core';
import * as file from '@cool-midway/file';
import * as localTask from '@midwayjs/task';
// import * as socketio from '@midwayjs/socketio';
// import * as task from '@cool-midway/task';
// import * as pay from '@cool-midway/pay';
// import * as es from '@cool-midway/es';
// import * as rpc from '@cool-midway/rpc';

@Configuration({
  imports: [
    // http://koajs.cn/
    koa,
    // 参数验证 http://midwayjs.org/docs/extensions/validate
    validate,
    // 本地任务 http://midwayjs.org/docs/extensions/task
    localTask,
    // 模板渲染 http://midwayjs.org/docs/extensions/render
    view,
    // 静态文件托管 http://midwayjs.org/docs/extensions/static_file
    staticFile,
    // typeorm https://typeorm.io  打不开？ https://typeorm.biunav.com/zh/
    orm,
    // socketio http://www.midwayjs.org/docs/extensions/socketio
    // socketio,
    // cool-admin 官方组件 https://www.cool-js.com
    cool,
    // 文件上传 阿里云存储 腾讯云存储 七牛云存储
    file,
    // 任务与队列
    // task,
    // 支付 微信与支付宝
    // pay,
    // elasticsearch
    // es,
    // rpc 微服务 远程调用
    // rpc,
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

  async onReady() {}
}
