import { ILifeCycle, ILogger, IMidwayContainer, Logger } from '@midwayjs/core';
import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { CoolCloudDb } from './db';

@Configuration({
  namespace: 'cloud',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolCloudConfiguration implements ILifeCycle {
  @Logger()
  coreLogger: ILogger;

  async onReady(container: IMidwayContainer) {
    await container.getAsync(CoolCloudDb);
    this.coreLogger.info('\x1B[36m [cool:cloud] ready \x1B[0m');
  }
}
