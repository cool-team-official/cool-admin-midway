import { App, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayWebApplication } from '@midwayjs/web';
import { BaseCoolQueue, Queue } from '@cool-midway/queue';
import { TaskInfoService } from '../service/info';
import { Job } from 'bullmq';

/**
 * 任务
 */
@Queue()
@Provide()
export abstract class TaskInfoQueue extends BaseCoolQueue {
  @App()
  app: IMidwayWebApplication;

  @Inject()
  taskInfoService: TaskInfoService;

  async data(job: Job, done: any): Promise<void> {
    try {
      const result = await this.taskInfoService.invokeService(job.data.service);
      this.taskInfoService.record(job.data, 1, JSON.stringify(result));
    } catch (error) {
      this.taskInfoService.record(job.data, 0, error.message);
    }
    if (!job.data.isOnce) {
      this.taskInfoService.updateNextRunTime(job.data.id);
      this.taskInfoService.updateStatus(job.data.id);
    }
    done();
  }
}
