import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import * as upload from '@midwayjs/upload';
import { IMidwayContainer } from '@midwayjs/core';
import { CoolFile } from './file';

@Configuration({
  namespace: 'cool:file',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
  imports: [upload],
})
export class CoolFileConfiguration {
  async onReady(container: IMidwayContainer) {
    await container.getAsync(CoolFile);
    // TODO something
  }
}
