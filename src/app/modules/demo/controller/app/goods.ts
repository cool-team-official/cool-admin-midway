import { Get, Inject, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { DemoAppGoodsEntity } from '../../entity/goods';
import { DemoGoodsService } from '../../service/goods';

/**
 * 商品
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoAppGoodsEntity,
})
export class DemoAppGoodsController extends BaseController {
  @Inject()
  demoGoodsService: DemoGoodsService;

  /**
   * 请求所有数据
   * @returns
   */
  @Get('/all')
  async all() {
    return this.ok(await this.demoGoodsService.all());
  }
}
