import { App, Provide } from '@midwayjs/decorator';
import { DemoGoodsEntity } from '../entity/goods';
import { IMidwayApplication, Inject } from '@midwayjs/core';
import {
  BaseRpcService,
  CoolRpc,
  CoolRpcService,
  CoolRpcTransaction,
} from '@cool-midway/rpc';
import { QueryRunner } from 'typeorm';

@Provide()
@CoolRpcService({
  entity: DemoGoodsEntity,
  method: ['info', 'add', 'page'],
})
export class DemoRpcService extends BaseRpcService {
  @App()
  app: IMidwayApplication;

  @Inject()
  rpc: CoolRpc;

  /**
   * 远程调用
   * @returns
   */
  async call() {
    return await this.rpc.call('goods', 'demoGoodsService', 'test', {
      a: 1,
    });
  }

  /**
   * 集群事件
   */
  async event() {
    this.rpc.event('test', { a: 1 });
  }

  async info(params) {
    return params;
  }
  async getUser() {
    return {
      uid: '123',
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  @CoolRpcTransaction()
  async transaction(params, rpcTransactionId?, queryRunner?: QueryRunner) {
    console.log('获得的参数', params);
    const data = {
      title: '商品标题',
      pic: 'https://xxx',
      price: 99.0,
      type: 1,
    };
    await queryRunner.manager.save(DemoGoodsEntity, data);

    // 将事务id传给调用的远程服务方法
    await this.rpc.call('goods', 'demoGoodsService', 'transaction', {
      rpcTransactionId,
      ...params,
    });
  }
}
