import { App, Inject, Provide } from '@midwayjs/decorator';
import { DemoGoodsEntity } from '../entity/goods';
import { IMidwayApplication } from '@midwayjs/core';
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
   * 分布式事务
   * @param params 方法参数
   * @param rpcTransactionId 无需调用者传参， 本次事务的ID，ID会自动注入无需调用者传参
   * @param queryRunner 无需调用者传参，操作数据库，需要用queryRunner操作数据库，才能统一提交或回滚事务
   */
  // 注解启用分布式事务，参数可以指定事务类型
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
    });
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
}
