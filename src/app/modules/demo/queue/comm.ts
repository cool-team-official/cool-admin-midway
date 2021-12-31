import { App, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { IMidwayWebApplication } from '@midwayjs/web';
import { BaseCoolQueue, Queue } from '@cool-midway/queue';

/**
 * 普通队列
 */
@Queue()
@Scope(ScopeEnum.Singleton)
@Provide()
export class DemoCommQueue extends BaseCoolQueue {
  @App()
  app: IMidwayWebApplication;

  async data(job: any, done: any): Promise<void> {
    // 这边可以执行定时任务具体的业务或队列的业务
    console.log('数据', job.data);
    // 抛出错误 可以让队列重试，默认重试5次
    //throw new Error('错误');
    done();
  }
}
