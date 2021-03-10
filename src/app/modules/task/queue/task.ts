import { App, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayWebApplication } from '@midwayjs/web';
import { ICoolQueue, Queue } from 'midwayjs-cool-queue';
import { TaskInfoService } from '../service/info';

/**
 * 任务
 */
@Queue()
@Provide()
export abstract class TaskInfoQueue implements ICoolQueue {
  @App()
  app: IMidwayWebApplication;

  @Inject()
  taskInfoService: TaskInfoService;

  async data(job: any, done: any): Promise<void> {
    try {
      console.log('收到的数据', job.data);
      const result = await this.taskInfoService.invokeService(job.data.service);
      this.taskInfoService.record(job.data, 1, JSON.stringify(result));
    } catch (error) {
      this.taskInfoService.record(job.data, 0, error);
    }
    this.taskInfoService.updateNextRunTime(job.data.id);
    this.taskInfoService.updateStatus();
    done();
  }
}
