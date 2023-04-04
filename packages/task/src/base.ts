import {
  Job,
  JobsOptions,
  Queue,
  QueueGetters,
  RepeatOptions,
  Worker,
} from 'bullmq';

/**
 * 队列基类
 */
export abstract class BaseCoolQueue {
  /**
   * @deprecated 将在后续版本废弃
   */
  queue: BaseCoolQueue;
  // 获得者
  getters: QueueGetters<any, any, any>;
  // 消费者
  worker: Worker;
  // 队列名
  queueName: string;
  // 原始队列
  metaQueue: Queue;

  constructor() {
    this.queue = this;
  }

  // 数据
  async data(job: Job, done: Function) {}

  /**
   * 发送数据
   * @param data
   * @param opts
   */
  async add(data: any, opts?: JobsOptions): Promise<Job<any, any, string>> {
    return this.metaQueue.add(this.queueName, data, opts);
  }

  /**
   * 批量新增
   * @param datas
   * @param opts
   */
  async addBulk(
    datas: any[],
    opts?: JobsOptions
  ): Promise<Job<any, any, string>[]> {
    return this.metaQueue.addBulk(
      datas.map(data => {
        return {
          name: this.queueName,
          data,
          opts,
        };
      })
    );
  }

  defaultJobOptions(): JobsOptions {
    return this.metaQueue.defaultJobOptions;
  }

  async repeat() {
    return this.metaQueue.repeat;
  }

  async pause() {
    this.metaQueue.pause();
  }

  async resume() {
    this.metaQueue.resume();
  }

  async isPaused() {
    return this.metaQueue.isPaused();
  }

  async getRepeatableJobs(start?: number, end?: number, asc?: boolean) {
    return this.metaQueue.getRepeatableJobs(start, end, asc);
  }

  async removeRepeatable(repeatOpts: RepeatOptions, jobId?: string) {
    this.metaQueue.removeRepeatable(this.queueName, repeatOpts, jobId);
  }

  async removeRepeatableByKey(key: string) {
    this.metaQueue.removeRepeatableByKey(key);
  }

  async remove(jobId: string) {
    return this.metaQueue.remove(jobId);
  }

  async drain(delayed?: boolean) {
    this.metaQueue.drain(delayed);
  }

  async clean(
    grace: number,
    limit: number,
    type?: 'completed' | 'wait' | 'active' | 'paused' | 'delayed' | 'failed'
  ) {
    return this.metaQueue.clean(grace, limit, type);
  }

  async obliterate(opts?: { force?: boolean; count?: number }) {
    this.metaQueue.obliterate(opts);
  }

  async trimEvents(maxLength: number) {
    return this.metaQueue.trimEvents(maxLength);
  }
}
