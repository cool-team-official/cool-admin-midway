import { Provide } from '@midwayjs/decorator';
import { ICoolQueue, Queue } from 'midwayjs-cool-queue';

/**
 * 队列
 */
@Queue()
@Provide()
export abstract class DemoOrderQueue implements ICoolQueue {
  data(job: any, done: any): void {
    console.log('收到的数据', job.data);
    done();
  }
}
