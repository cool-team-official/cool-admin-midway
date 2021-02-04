import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';

@Configuration()
export class ContainerLifeCycle implements ILifeCycle {

  @App()
  app: Application;

  async onReady() {
    this.app.use(async (ctx, next) => {
      console.log('这边请求到了')
      await next();
    });
  }
}
