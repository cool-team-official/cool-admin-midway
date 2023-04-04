import { Controller, Inject, Post, Provide } from '@midwayjs/decorator';
import { BaseController } from '@cool-midway/core';
import { CoolRpc } from './rpc';

/**
 * 本地开发调试
 */
@Provide()
@Controller('/rpc')
export class RpcTestController extends BaseController {
  @Inject()
  rpc: CoolRpc;

  @Inject()
  ctx;

  /**
   * 测试
   */
  @Post('/test')
  async test() {
    const { name, service, method, params } = this.ctx.request.body;
    return this.rpc.call(name, service, method, params);
  }
}
