import { Get, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { DemoAppGoodsEntity } from '../../entity/goods';
import { Repository } from 'typeorm';
import { BaseSysMenuEntity } from '../../../base/entity/sys/menu';

/**
 * 商品
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoAppGoodsEntity
})
export class DemoAppGoodsController extends BaseController {

  @InjectEntityModel(BaseSysMenuEntity)
  baseSysMenuEntity: Repository<BaseSysMenuEntity>;

  @Get('/123')
  async 123() {
    const ms = await this.baseSysMenuEntity.find();
    for (const item of ms) {
      if(item.perms){
        let a = item.perms.split(',')
        a = a.map(e=>{
          return 'base:'+e;
        })
        item.perms = a.join(',')
        this.baseSysMenuEntity.update(item.id, item)
      }
    }
    return this.ok(122)
  }
}