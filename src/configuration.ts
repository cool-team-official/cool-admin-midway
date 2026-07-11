/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import * as orm from '@midwayjs/typeorm';
import {
  App,
  Configuration,
  ILogger,
  IMidwayApplication,
  Inject,
  MidwayWebRouterService,
} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
// import * as crossDomain from '@midwayjs/cross-domain';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as staticFile from '@midwayjs/static-file';
import * as cron from '@midwayjs/cron';
import * as DefaultConfig from './config/config.default';
import * as LocalConfig from './config/config.local';
import * as ProdConfig from './config/config.prod';
import * as cool from '@cool-midway/core';
import * as upload from '@midwayjs/upload';
// import * as task from '@cool-midway/task';
// import * as rpc from '@cool-midway/rpc';
import * as prometheus from '@midwayjs/prometheus'; // 导入模块
import * as redis from '@midwayjs/redis';
import { SpaHistoryFallbackMiddleware } from './modules/base/middleware/spaHistoryFallback';

@Configuration({
  imports: [
    // https://koajs.com/
    koa,
    // 是否开启跨域(注：顺序不能乱放！！！) http://www.midwayjs.org/docs/extensions/cross_domain
    // crossDomain,
    // 静态文件托管 https://midwayjs.org/docs/extensions/static_file
    staticFile,
    // orm https://midwayjs.org/docs/extensions/orm
    orm,
    // 参数验证 https://midwayjs.org/docs/extensions/validate
    validate,
    // 本地任务 http://www.midwayjs.org/docs/extensions/cron
    cron,
    // 文件上传
    upload,
    // cool-admin 官方组件 https://cool-js.com
    cool,
    // rpc 微服务 远程调用
    // rpc,
    // 任务与队列
    // task,
    {
      component: info,
      enabledEnvironment: ['local', 'prod'],
    },
    prometheus,
    redis, // 导入 redis 组件
  ],
  importConfigs: [
    {
      default: DefaultConfig,
      local: LocalConfig,
      prod: ProdConfig,
    },
  ],
})
export class MainConfiguration {
  @App()
  app: IMidwayApplication;

  @Inject()
  webRouterService: MidwayWebRouterService;

  @Inject()
  logger: ILogger;

  async onReady() {
    // 注册 SPA History 回退中间件，确保在最前面执行
    this.app.useMiddleware(SpaHistoryFallbackMiddleware);

    // 处理未捕获的 Promise rejection
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.logger.error('未处理的 Promise Rejection', {
        reason: reason?.message || reason,
        stack: reason?.stack,
        promise: promise.toString(),
      });

      // 如果是数据库连接错误，记录详细信息
      if (
        reason?.code === 'ER_NET_READ_INTERRUPTED' ||
        reason?.code === 'ETIMEDOUT'
      ) {
        this.logger.error('数据库连接错误', {
          code: reason.code,
          errno: reason.errno,
          sqlState: reason.sqlState,
          sqlMessage: reason.sqlMessage,
        });
      }

      // 不退出进程，让应用继续运行
      // 生产环境可以考虑记录到监控系统
    });

    // 处理未捕获的异常
    process.on('uncaughtException', (error: Error) => {
      this.logger.error('未捕获的异常', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // 对于数据库连接错误，不退出进程
      if (
        error.message?.includes('timeout') ||
        error.message?.includes('ETIMEDOUT') ||
        error.message?.includes('ER_NET_READ_INTERRUPTED')
      ) {
        this.logger.warn('数据库连接超时，应用将继续运行');
        return;
      }

      // 其他严重错误，记录后退出
      this.logger.error('严重错误，进程将退出');
      process.exit(1);
    });
  }
}
