import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { Application } from 'egg';
// import * as orm from '@midwayjs/orm';
import * as cool from 'midwayjs-cool-core';

@Configuration({
  imports: [
    // cool-admin 官方组件 https://www.cool-js.com
    cool
    //orm
  ]
})
export class ContainerLifeCycle implements ILifeCycle {

  @App()
  app: Application;
  // 应用启动完成
  async onReady(container?: IMidwayContainer) {
    //this.app.use(await this.app.generateMiddleware('reportMiddleware'));
  }
  // 应用停止
  async onStop() {

  }
}
