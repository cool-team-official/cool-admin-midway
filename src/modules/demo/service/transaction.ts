import { DemoGoodsEntity } from './../entity/goods';
import { Provide } from '@midwayjs/decorator';
import { BaseService, CoolTransaction } from '@cool-midway/core';
import { QueryRunner } from 'typeorm';

/**
 * 操作事务
 */
@Provide()
export class DemoTransactionService extends BaseService {
  /**
   * 事务操作
   */
  @CoolTransaction({
    connectionName: 'default',
  })
  async add(param, queryRunner?: QueryRunner) {
    await queryRunner.manager.insert<DemoGoodsEntity>(DemoGoodsEntity, param);
    return {
      id: param.id,
    };
  }
}
