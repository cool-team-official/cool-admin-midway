import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, Cache, CoolTransaction } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, QueryRunner } from 'typeorm';
import { DemoGoodsEntity } from '../entity/goods';
import { ICoolCache } from '@cool-midway/core';

/**
 * 商品
 */
@Provide()
export class DemoGoodsService extends BaseService {
  @InjectEntityModel(DemoGoodsEntity)
  demoAppGoodsEntity: Repository<DemoGoodsEntity>;

  @Inject('cool:cache')
  coolCache: ICoolCache;

  /**
   * 返回所有数据
   */
  @Cache(5)
  async all() {
    return this.demoAppGoodsEntity.find();
  }

  /**
   * 事务
   * @param params
   * @param queryRunner
   */
  @CoolTransaction({ isolation: 'SERIALIZABLE' })
  async testTransaction(params: any, queryRunner?: QueryRunner) {
    await queryRunner.manager.insert<DemoGoodsEntity>(DemoGoodsEntity, {
      title: '这是个商品',
      pic: '商品图',
      price: 99.0,
      type: 1,
    });
  }
}
