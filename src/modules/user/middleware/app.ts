import { ALL, Config, Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, Init, Inject } from '@midwayjs/core';
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

  ignoreUrls: string[] = [];

  @Config('koa.globalPrefix')
  prefix;

  @Init()
  async init() {
    this.ignoreUrls = this.coolUrlTagData.byKey(TagTypes.IGNORE_TOKEN, 'app');
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      let { url } = ctx;
      url = url.replace(this.prefix, '').split('?')[0];
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
        // 使用matchUrl方法来检查URL是否应该被忽略
        const isIgnored = this.ignoreUrls.some(pattern =>
          this.matchUrl(pattern, url)
        );
        if (isIgnored) {
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

  // 匹配URL的方法
  matchUrl(pattern, url) {
    const patternSegments = pattern.split('/').filter(Boolean);
    const urlSegments = url.split('/').filter(Boolean);

    // 如果段的数量不同，则无法匹配
    if (patternSegments.length !== urlSegments.length) {
      return false;
    }

    // 逐段进行匹配
    for (let i = 0; i < patternSegments.length; i++) {
      if (patternSegments[i].startsWith(':')) {
        // 如果模式段以':'开始，我们认为它是一个参数，可以匹配任何内容
        continue;
      }
      // 如果两个段不相同，则不匹配
      if (patternSegments[i] !== urlSegments[i]) {
        return false;
      }
    }

    // 所有段都匹配
    return true;
  }
}
