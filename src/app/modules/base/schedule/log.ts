// src/schedule/hello.ts
import { Provide, Inject, Schedule, CommonSchedule } from '@midwayjs/decorator';
import { BaseSysLogService } from '../service/sys/log';
import { ILogger } from '@midwayjs/logger';

/**
 * 日志定时任务
 */
@Provide()
@Schedule({
  cron: '0 0 0 * * *', // 每天0点执行
  type: 'worker', // 指定某一个 worker 执行
})
export class BaseLogSchedule implements CommonSchedule {
  @Inject()
  baseSysLogService: BaseSysLogService;

  @Inject()
  logger: ILogger;

  // 定时执行的具体任务
  async exec() {
    this.logger.info('清除日志定时任务开始执行');
    const startTime = Date.now();
    await this.baseSysLogService.clear();
    this.logger.info(`清除日志定时任务结束，耗时:${Date.now() - startTime}ms`);
  }
}
