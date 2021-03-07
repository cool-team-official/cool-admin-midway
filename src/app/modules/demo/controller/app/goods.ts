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
  entity: DemoAppGoodsEntity,
})
export class DemoAppGoodsController extends BaseController {
 
}
