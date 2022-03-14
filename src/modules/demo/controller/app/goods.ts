import { DemoGoodsEntity } from '../../entity/goods';
import { BaseController, CoolController } from '@cool-midway/core';
import { DemoGoodsService } from '../../service/goods';

/**
 * 测试
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page', 'list'],
  entity: DemoGoodsEntity,
  service: DemoGoodsService,
})
export class CoolGoodsController extends BaseController {}
