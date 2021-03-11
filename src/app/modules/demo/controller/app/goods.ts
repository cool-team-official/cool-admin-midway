import { Get, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { DemoAppGoodsEntity } from '../../entity/goods';

/**
 * 商品
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoAppGoodsEntity,
})
export class DemoAppGoodsController extends BaseController {
  /**
   * 其他接口
   */
  @Get('/other')
  async other() {
    return this.ok('hello, cool-admin!!!');
  }
}
