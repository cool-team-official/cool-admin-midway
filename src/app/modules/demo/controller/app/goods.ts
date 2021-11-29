import { Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { IQueue } from '@cool-midway/queue';
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
  demoQueue: IQueue;

  /**
   * 请求所有数据
   * @returns
   */
  @Get('/all')
  async all() {
    return this.ok(await this.demoGoodsService.all());
  }

  /**
   * 发送数据到队列
   */
  @Post('/queue')
  async queue() {
    this.demoQueue.queue.add(
      { a: 1 },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }
}
