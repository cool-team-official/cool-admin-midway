import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext, IMidwayWebContext } from '@midwayjs/web';

/**
 * 日志中间件
 */
@Provide()
export class AdminLogsMiddleware implements IWebMiddleware {

    resolve() {
        return async (ctx: IMidwayWebContext, next: IMidwayWebNext) => {
            // 控制器前执行的逻辑
            const startTime = Date.now();
            // 执行下一个 Web 中间件，最后执行到控制器
            await next();
            // 控制器之后执行的逻辑
            console.log(Date.now() - startTime);
        };
    }

}