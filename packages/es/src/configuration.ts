import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayContainer } from '@midwayjs/core';
import { CoolElasticSearch } from './elasticsearch';

@Configuration({
  namespace: 'cool:es',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolEsConfiguration {
  async onReady(container: IMidwayContainer) {
    await container.getAsync(CoolElasticSearch);
    // TODO something
  }
}
