import { Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController, CoolUrlTag } from '@cool-midway/core';
import { DemoGoodsEntity } from '../../entity/goods';
import { DemoGoodsService } from '../../service/goods';
import { DemoQueue } from '../../queue/demo';

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

  // 队列
  @Inject()
  demoQueue: DemoQueue;

  /**
   * 请求所有数据
   * @returns
   */
  @CoolUrlTag('ignoreToken')
  @Get('/all', { summary: '获得所有' })
  async all() {
    return this.ok(await this.demoGoodsService.all());
  }

  /**
   * 发送数据到队列
   */
  @Post('/queue', { summary: '发送队列数据' })
  async queue() {
    console.log(111, this.demoQueue);
    this.demoQueue.add({ a: 2 }, { delay: 2000 });
  }
}
