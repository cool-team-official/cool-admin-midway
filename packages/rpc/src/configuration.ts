import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayContainer } from '@midwayjs/core';
import { CoolRpc } from './rpc';
import { CoolRpcDecorator } from './decorator';

@Configuration({
  namespace: 'cool:rpc',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolRpcConfiguration {
  async onReady(container: IMidwayContainer) {
    global['moleculer.transactions'] = {};
    (await container.getAsync(CoolRpc)).init();
    // 装饰器
    await container.getAsync(CoolRpcDecorator);
  }

  async onStop(container: IMidwayContainer): Promise<void> {
    (await container.getAsync(CoolRpc)).stop();
  }
}
