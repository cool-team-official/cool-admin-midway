import { App, Config, Inject, Middleware } from '@midwayjs/decorator';
import * as _ from 'lodash';
import { RESCODE } from '@cool-midway/core';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, IMidwayApplication } from '@midwayjs/core';
import { CacheManager } from '@midwayjs/cache';

/**
 * 权限校验
 */
@Middleware()
export class BaseAuthorityMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config('koa.globalPrefix')
  prefix;

  @Config('module.base')
  jwtConfig;

  @Inject()
  cacheManager: CacheManager;

  @App()
  app: IMidwayApplication;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      let statusCode = 200;
      let { url } = ctx;
      url = url.replace(this.prefix, '');
      const token = ctx.get('Authorization');
      const adminUrl = '/admin/';
      //忽略token验证的url
      const ignoreUrls = [];
      // 路由地址为 admin前缀的 需要权限校验
      if (_.startsWith(url, adminUrl)) {
        try {
          ctx.admin = jwt.verify(token, this.jwtConfig.jwt.secret);
        } catch (err) {}
        // 不需要登录 无需权限校验
        if (
          new RegExp(`^${adminUrl}?.*/open/`).test(url) ||
          ignoreUrls.includes(url)
        ) {
          await next();
          return;
        }
        if (ctx.admin) {
          const rToken = await this.cacheManager.get(
            `admin:token:${ctx.admin.userId}`
          );
          // 超管拥有所有权限
          if (ctx.admin.username == 'admin' && !ctx.admin.isRefresh) {
            if (rToken !== token && this.jwtConfig.jwt.sso) {
              ctx.status = 401;
              ctx.body = {
                code: RESCODE.COMMFAIL,
                message: '登录失效~',
              };
              return;
            } else {
              await next();
              return;
            }
          }
          // 要登录每个人都有权限的接口
          if (
            new RegExp(`^${adminUrl}?.*/comm/`).test(url) ||
            // 字典接口
            url == '/admin/dict/info/data'
          ) {
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
          // 判断密码版本是否正确
          const passwordV = await this.cacheManager.get(
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

          if (!rToken) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效或无权限访问~',
            };
            return;
          }
          if (rToken !== token && this.jwtConfig.jwt.sso) {
            statusCode = 401;
          } else {
            let perms: string[] = await this.cacheManager.get(
              `admin:perms:${ctx.admin.userId}`
            );
            if (!_.isEmpty(perms)) {
              perms = perms.map(e => {
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
