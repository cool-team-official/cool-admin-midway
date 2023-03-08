import { BaseCoolQueue, CoolQueue } from '@cool-midway/task';
import { IMidwayApplication } from '@midwayjs/core';
import { App } from '@midwayjs/decorator';

/**
 * 单例队列，cluster 或 集群模式下 只会有一个实例消费数据
 */
@CoolQueue({ type: 'single' })
export class DemoSingleQueue extends BaseCoolQueue {
  @App()
  app: IMidwayApplication;

  async data(job: any, done: any): Promise<void> {
    // 这边可以执行定时任务具体的业务或队列的业务
    console.log('数据', job.data);
    // 抛出错误 可以让队列重试，默认重试5次
    //throw new Error('错误');
    done();
  }
}
