import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayContainer } from '@midwayjs/core';
import { CoolWxPay } from './wx';
import { CoolAliPay } from './ali';

@Configuration({
  namespace: 'cool:pay',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolPayConfiguration {
  async onReady(container: IMidwayContainer) {
    await container.getAsync(CoolWxPay);
    await container.getAsync(CoolAliPay);
    // TODO something
  }
}
