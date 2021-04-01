import { App, Config, Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  IMidwayWebApplication,
} from '@midwayjs/web';
import * as _ from 'lodash';
import { CoolConfig, RESCODE } from 'midwayjs-cool-core';
import * as jwt from 'jsonwebtoken';
import { Context } from 'egg';

/**
 * 权限校验
 */
@Provide()
export class BaseAuthorityMiddleware implements IWebMiddleware {
  @Config('cool')
  coolConfig: CoolConfig;

  coolCache;

  @App()
  app: IMidwayWebApplication;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      let statusCode = 200;
      let { url } = ctx;
      const { prefix } = this.coolConfig.router;
      url = url.replace(prefix, '');
      const token = ctx.get('Authorization');
      const adminUrl = '/admin/';
      // 路由地址为 admin前缀的 需要权限校验
      if (_.startsWith(url, adminUrl)) {
        try {
          ctx.admin = jwt.verify(token, this.coolConfig.jwt.secret);
        } catch (err) { }
        // 不需要登录 无需权限校验
        if (new RegExp(`^${adminUrl}?.*/open/`).test(url)) {
          await next();
          return;
        }
        if (ctx.admin) {
          // 超管拥有所有权限
          if (ctx.admin.username == 'admin' && !ctx.admin.isRefresh) {
            await next();
            return;
          }
          // 要登录每个人都有权限的接口
          if (new RegExp(`^${adminUrl}?.*/comm/`).test(url)) {
            await next();
            return;
          }
          // 如果传的token是refreshToken则校验失败
          if (ctx.admin.isRefresh) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效~',
            };
            return;
          }
          // 需要动态获得缓存
          this.coolCache = await ctx.requestContext.getAsync('cool:cache');
          // 判断密码版本是否正确
          const passwordV = await this.coolCache.get(
            `admin:passwordVersion:${ctx.admin.userId}`
          );
          if (passwordV != ctx.admin.passwordVersion) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效~',
            };
            return;
          }
          const rToken = await this.coolCache.get(
            `admin:token:${ctx.admin.userId}`
          );
          if (!rToken) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效或无权限访问~',
            };
            return;
          }
          if (rToken !== token && this.coolConfig.sso) {
            statusCode = 401;
          } else {
            let perms = await this.coolCache.get(
              `admin:perms:${ctx.admin.userId}`
            );
            if (!_.isEmpty(perms)) {
              perms = JSON.parse(perms).map(e => {
                return e.replace(/:/g, '/');
              });
              if (!perms.includes(url.split('?')[0].replace('/admin/', ''))) {
                statusCode = 403;
              }
            } else {
              statusCode = 403;
            }
          }
        } else {
          statusCode = 401;
        }
        if (statusCode > 200) {
          ctx.status = statusCode;
          ctx.body = {
            code: RESCODE.COMMFAIL,
            message: '登录失效或无权限访问~',
          };
          return;
        }
      }
      await next();
    };
  }
}
