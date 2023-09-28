import { Inject, Provide, Get } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { DemoRpcService } from '../../service/rpc';

/**
 * 远程RPC调用
 */
@Provide()
@CoolController()
export class AppDemoRpcController extends BaseController {
  @Inject()
  demoRpcService: DemoRpcService;

  @Get('/call', { summary: '远程调用' })
  async call() {
    return this.ok(await this.demoRpcService.call());
  }

  @Get('/event', { summary: '集群事件' })
  async event() {
    await this.demoRpcService.event();
    return this.ok();
  }

  @Get('/transaction', { summary: '分布式事务' })
  async transaction() {
    await this.demoRpcService.transaction({ a: 1 });
    return this.ok();
  }
}
