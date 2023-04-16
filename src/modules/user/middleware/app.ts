import { ALL, Config, Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, Inject } from '@midwayjs/core';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { CoolUrlTagData, RESCODE, TagTypes } from '@cool-midway/core';

/**
 * 用户
 */
@Middleware()
export class UserMiddleware implements IMiddleware<Context, NextFunction> {
  @Config(ALL)
  coolConfig;

  @Inject()
  coolUrlTagData: CoolUrlTagData;

  @Config('module.user.jwt')
  jwtConfig;

  protected ignoreUrls = [];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      this.ignoreUrls = this.ignoreUrls.concat(
        this.coolUrlTagData.byKey(TagTypes.IGNORE_TOKEN)
      );
      let { url } = ctx;
      url = url.split('?')[0];
      if (_.startsWith(url, '/app/')) {
        const token = ctx.get('Authorization');
        try {
          ctx.user = jwt.verify(token, this.jwtConfig.secret);
          if (ctx.user.isRefresh) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效~',
            };
            return;
          }
        } catch (error) {}
        if (this.ignoreUrls.includes(url)) {
          await next();
          return;
        } else {
          if (!ctx.user) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效~',
            };
            return;
          }
        }
      }
      await next();
    };
  }
}
