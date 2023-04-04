import { ILogger, IMidwayApplication } from '@midwayjs/core';
import {
  App,
  Config,
  getClassMetadata,
  Init,
  listModule,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import { Job, QueueGetters, Queue, Worker } from 'bullmq';
import { BaseCoolQueue } from './base';
import { COOL_TASK_KEY } from './decorator/queue';
import Redis from 'ioredis';

/**
 * 任务队列
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolQueueHandle {
  @Config('cool.redis')
  redisConfig;

  @Logger()
  coreLogger: ILogger;

  @App()
  app: IMidwayApplication;

  redis;

  @Init()
  async init() {
    if (!this.redisConfig) {
      this.coreLogger.error('@cool-midway/task组件 redis未配置');
    }

    await this.scan();
  }

  /**
   * 扫描队列
   */
  async scan() {
    const modules = listModule(COOL_TASK_KEY);
    for (let mod of modules) {
      const cls: BaseCoolQueue = await this.app
        .getApplicationContext()
        .getAsync(mod);
      this.createQueue(cls, mod);
    }
  }

  /**
   * 获得锁
   * @param key 键
   * @param expireTime 过期时间
   * @returns
   */
  async getLock(key, expireTime) {
    const lockSuccessful = await this.redis.setnx(key, 'locked');
    if (lockSuccessful) {
      await this.redis.expire(key, expireTime);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 队列名称
   * @param cls
   * @param mod
   */
  async createQueue(cls: BaseCoolQueue, mod: any) {
    this.redis;
    if (this.redisConfig instanceof Array) {
      this.redis = new Redis.Cluster(this.redisConfig, {
        enableReadyCheck: false,
      });
    } else {
      this.redis = new Redis({
        ...this.redisConfig,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      });
    }
    const name = mod.name;
    const config = getClassMetadata(COOL_TASK_KEY, mod);
    const opts = {
      connection: this.redis,
      prefix: `{queue${name}}`,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 5,
        backoff: {
          type: 'fixed',
          delay: 10000,
        },
        ...(config.queue || {}),
      },
    };
    const queue = new Queue(name, opts);
    cls.metaQueue = queue;
    cls.queueName = name;
    let lock = false;
    // 本地开发的情况下直接获得锁
    if (config.type == 'single') {
      if (this.app.getEnv() == 'local') {
        lock = true;
      } else {
        // cluster 需要配合redis 获得锁
        if (await this.getLock('COOL_QUEUE_SINGLE', 15)) {
          lock = true;
        }
      }
    }

    if (config.type == 'comm' || (config.type == 'single' && lock)) {
      cls.worker = new Worker(
        name,
        async (job: Job) => {
          await cls.data(job, async () => {
            await job.isCompleted();
          });
        },
        {
          connection: opts.connection,
          prefix: opts.prefix,
          ...(config.worker || {}),
        }
      );
    } else {
      cls.getters = new QueueGetters(name, opts);
    }
    this.coreLogger.info(`\x1B[36m [cool:task] create ${name} queue \x1B[0m`);
  }
}
