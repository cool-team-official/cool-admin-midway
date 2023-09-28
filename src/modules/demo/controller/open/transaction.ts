import { DemoGoodsEntity } from '../../entity/goods';
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { DemoTransactionService } from '../../service/transaction';

/**
 * 事务
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoGoodsEntity,
  service: DemoTransactionService,
})
export class AppDemoTransactionController extends BaseController {}
