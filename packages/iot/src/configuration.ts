import { CoolMqttServe } from './mqtt';
import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayContainer } from '@midwayjs/core';

@Configuration({
  namespace: 'cool:iot',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolIotConfiguration {
  async onReady(container: IMidwayContainer) {
    (await container.getAsync(CoolMqttServe)).init();
  }
}
