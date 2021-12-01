import { ICoolUrlTag } from '@cool-midway/core';
import { App, Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  IMidwayWebApplication,
} from '@midwayjs/web';
import { Context } from 'egg';

/**
 * 描述
 */
@Provide()
export class DemoUserMiddleware implements IWebMiddleware {
  @App()
  app: IMidwayWebApplication;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      // 获得请求路径标签，可以利用此处来判断是否忽略token校验，以及其他需求场景
      const urlTag: ICoolUrlTag = await this.app
        .getApplicationContext()
        .getAsync('cool:urlTag');
      console.log('urlTag', urlTag);
      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      await next();
      // 控制器之后执行的逻辑
      console.log(Date.now() - startTime);
    };
  }
}
