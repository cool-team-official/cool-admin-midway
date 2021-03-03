import { Inject, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { BaseSysLogService } from '../service/sys/log';
import { Context } from 'egg';

/**
 * 日志中间件
 */
@Provide()
export class BaseLogMiddleware implements IWebMiddleware {
  @Inject()
  baseSysLogService: BaseSysLogService;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      this.baseSysLogService.record(
        ctx,
        ctx.url.split('?')[0],
        ctx.req.method === 'GET' ? ctx.request.query : ctx.request.body,
        ctx.admin ? ctx.admin.userId : null
      );
      await next();
    };
  }
}
