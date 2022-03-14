import { Middleware } from '@midwayjs/decorator';
import * as _ from 'lodash';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware } from '@midwayjs/core';
import { BaseSysLogService } from '../service/sys/log';

/**
 * 日志中间件
 */
@Middleware()
export class BaseLogMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const baseSysLogService = await ctx.requestContext.getAsync(
        BaseSysLogService
      );
      baseSysLogService.record(
        ctx,
        ctx.url.split('?')[0],
        ctx.req.method === 'GET' ? ctx.request.query : ctx.request.body,
        ctx.admin ? ctx.admin.userId : null
      );
      await next();
    };
  }
}
