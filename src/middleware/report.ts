import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext, IMidwayWebContext } from '@midwayjs/web';

@Provide()
export class ReportMiddleware implements IWebMiddleware {

   resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext) => {
      console.log('请求进来了')
      const startTime = Date.now();
      await next();
      console.log('请求时间', Date.now() - startTime);
    };
  }

}