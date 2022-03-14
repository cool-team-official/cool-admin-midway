import { App, Inject } from '@midwayjs/decorator';
import { BaseCoolQueue, CoolQueue } from '@cool-midway/task';
import { TaskInfoService } from '../service/info';
import { Job } from 'bullmq';
import { IMidwayApplication } from '@midwayjs/core';

/**
 * 任务
 */
@CoolQueue()
export abstract class TaskInfoQueue extends BaseCoolQueue {
  @App()
  app: IMidwayApplication;

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
