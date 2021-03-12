import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, Cache } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { DemoAppGoodsEntity } from '../entity/goods';
import { ICoolCache } from 'midwayjs-cool-core';

/**
 * 商品
 */
@Provide()
export class DemoGoodsService extends BaseService {
  @InjectEntityModel(DemoAppGoodsEntity)
  demoAppGoodsEntity: Repository<DemoAppGoodsEntity>;

  @Inject('cool:cache')
  coolCache: ICoolCache;

  /**
   * 返回所有数据
   */
  @Cache(5)
  async all() {
    return this.demoAppGoodsEntity.find();
  }
}
