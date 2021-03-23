import { App, Provide } from '@midwayjs/decorator';
import { IMidwayWebApplication } from '@midwayjs/web';
import { ICoolQueue, Queue } from 'midwayjs-cool-queue';

/**
 * 任务
 */
@Queue()
@Provide()
export abstract class DemoQueue implements ICoolQueue {
  @App()
  app: IMidwayWebApplication;

  async data(job: any, done: any): Promise<void> {
    // 这边可以执行定时任务具体的业务或队列的业务
    console.log('数据', job.data);
    done();
  }
}
