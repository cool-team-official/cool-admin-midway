import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayContainer } from '@midwayjs/core';

@Configuration({
  namespace: 'cool:sms',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolPayConfiguration {
  async onReady(container: IMidwayContainer) {
    // TODO something
  }
}
