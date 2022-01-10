import { Get, Inject, Provide, Query } from '@midwayjs/decorator';
import { CoolController, BaseController, CoolUrlTag } from '@cool-midway/core';
import { DemoGoodsEntity } from '../../entity/goods';
import { DemoGoodsService } from '../../service/goods';

/**
 * 商品
 */
@Provide()
@CoolController(
  {
    api: ['add', 'delete', 'update', 'info', 'list', 'page'],
    entity: DemoGoodsEntity,
    urlTag: {
      name: 'ignoreToken',
      url: ['add'],
    },
    listQueryOp: {
      keyWordLikeFields: ['title'],
    },
  },
  {
    middleware: [],
  }
)
export class DemoAppGoodsController extends BaseController {
  @Inject()
  demoGoodsService: DemoGoodsService;

  /**
   * 请求所有
   * @param name 名称
   * @returns
   */
  @CoolUrlTag('ignoreToken')
  @Get('/all', { summary: '获得所有' })
  async all(@Query() name: string, @Query() age: number) {
    return this.ok(await this.demoGoodsService.all());
  }
}
