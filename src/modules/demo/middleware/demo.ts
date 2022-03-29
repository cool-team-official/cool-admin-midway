import { CoolUrlTagData, TagTypes } from '@cool-midway/core';
import { IMiddleware } from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class DemoMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  tag: CoolUrlTagData;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const urls = this.tag.byKey(TagTypes.IGNORE_TOKEN);

      console.log('忽略token的URL数组', urls);

      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      // 控制器之后执行的逻辑
      console.log(Date.now() - startTime);
      // 返回给上一个中间件的结果
      return result;
    };
  }
}
