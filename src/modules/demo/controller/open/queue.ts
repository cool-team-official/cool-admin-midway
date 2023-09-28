import { Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { DemoCommQueue } from '../../queue/comm';
import { DemoGetterQueue } from '../../queue/getter';

/**
 * 队列
 */
@Provide()
@CoolController()
export class DemoQueueController extends BaseController {
  // 普通队列
  @Inject()
  demoCommQueue: DemoCommQueue;

  // 主动消费队列
  @Inject()
  demoGetterQueue: DemoGetterQueue;

  /**
   * 发送数据到队列
   */
  @Post('/add', { summary: '发送队列数据' })
  async queue() {
    this.demoCommQueue.add({ a: 2 });
    return this.ok();
  }

  @Post('/addGetter')
  async addGetter() {
    await this.demoGetterQueue.add({ a: new Date() });
    return this.ok();
  }

  /**
   * 获得队列中的数据，只有当队列类型为getter时有效
   */
  @Get('/getter')
  async getter() {
    const job = await this.demoGetterQueue.getters.getJobs(
      ['wait'],
      0,
      0,
      true
    );
    // 获得完将数据从队列移除
    await job[0]?.remove();
    return this.ok(job[0]?.data);
  }
}
