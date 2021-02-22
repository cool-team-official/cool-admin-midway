import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext, IMidwayWebContext } from '@midwayjs/web';

@Provide()
export class ReportMiddleware1 implements IWebMiddleware {

   resolve() {
    return async (ctx: IMidwayWebContext, next: IMidwayWebNext) => {
      console.log('请求进来了1111')
      const startTime = Date.now();
      await next();
      console.log('请求时间1111', Date.now() - startTime);
    };
  }

}