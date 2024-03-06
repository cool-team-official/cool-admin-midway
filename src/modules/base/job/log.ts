import { Job, IJob } from '@midwayjs/cron';
import { FORMAT, ILogger, Inject } from '@midwayjs/core';
import { BaseSysLogService } from '../service/sys/log';

/**
 * 日志定时任务
 */
@Job({
  cronTime: FORMAT.CRONTAB.EVERY_DAY,
  start: true,
})
export class BaseLogJob implements IJob {
  @Inject()
  baseSysLogService: BaseSysLogService;

  @Inject()
  logger: ILogger;

  async onTick() {
    this.logger.info('清除日志定时任务开始执行');
    const startTime = Date.now();
    await this.baseSysLogService.clear();
    this.logger.info(`清除日志定时任务结束，耗时:${Date.now() - startTime}ms`);
  }
}
