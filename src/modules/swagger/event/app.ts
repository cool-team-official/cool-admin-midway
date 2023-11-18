import { CoolEvent, Event } from '@cool-midway/core';
import { App, ILogger, Inject, Logger } from '@midwayjs/core';
import { IMidwayKoaApplication } from '@midwayjs/koa';
import { SwaggerBuilder } from '../builder';

/**
 * 修改jwt.secret
 */
@CoolEvent()
export class SwaggerAppEvent {
  @Logger()
  coreLogger: ILogger;

  @App()
  app: IMidwayKoaApplication;

  @Inject()
  swaggerBuilder: SwaggerBuilder;

  @Event('onServerReady')
  async onServerReady() {
    this.swaggerBuilder.init().then(() => {
      this.coreLogger.info(
        '\x1B[36m [cool:module:swagger] midwayjs cool module swagger build success\x1B[0m'
      );
    });
  }
}
