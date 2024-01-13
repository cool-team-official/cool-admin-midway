import { DemoGoodsEntity } from './../entity/goods';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 商品示例
 */
@Provide()
export class DemoGoodsService extends BaseService {
  @InjectEntityModel(DemoGoodsEntity)
  demoGoodsEntity: Repository<DemoGoodsEntity>;

  /**
   * 执行sql分页
   */
  async sqlPage(query) {
    await this.demoGoodsEntity.save({
      id: 11,
      title: '11',
      price: 11,
      description: '11',
      mainImage: '11',
    });
    await this.demoGoodsEntity.delete({ id: 11 });
    return this.sqlRenderPage(
      'select * from demo_goods ORDER BY id ASC',
      query,
      false
    );
  }

  /**
   * 执行entity分页
   */
  async entityPage(query) {
    const find = this.demoGoodsEntity.createQueryBuilder();
    return this.entityRenderPage(find, query);
  }
}
