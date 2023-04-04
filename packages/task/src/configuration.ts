import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayContainer } from '@midwayjs/core';
import { CoolQueueHandle } from './queue';

@Configuration({
  namespace: 'cool:task',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolTaskConfiguration {
  async onReady(container: IMidwayContainer) {
    await container.getAsync(CoolQueueHandle);
    // TODO something
  }
}
