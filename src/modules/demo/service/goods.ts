import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { CoolRpc } from '@cool-midway/rpc';

/**
 * 缓存
 */
@Provide()
export class DemoGoodsService extends BaseService {
  @Inject()
  rpc: CoolRpc;

  async test() {
    console.log('调用');
  }
}
