import { Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { CoolRpc } from '@cool-midway/rpc';
import { DemoRpcService } from '../../service/rpc';

/**
 * 微服务
 */
@Provide()
@CoolController()
export class DemoRpcController extends BaseController {
  @Inject()
  rpc: CoolRpc;

  @Inject()
  demoRpcService: DemoRpcService;

  @Post('/call', { summary: '远程调用' })
  async call() {
    return this.ok(
      await this.rpc.call('goods', 'demoGoodsService', 'test', { a: 1 })
    );
  }

  @Post('/event', { summary: '集群事件' })
  async event() {
    this.rpc.broadcastEvent('test', { a: 1 });
    return this.ok();
  }

  @Post('/transaction', { summary: '分布式事务' })
  async transaction() {
    await this.demoRpcService.transaction({ a: 1 });
    return this.ok();
  }
}
