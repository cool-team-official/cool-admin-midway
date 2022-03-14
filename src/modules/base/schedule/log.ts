import {
  Provide,
  Inject,
  CommonSchedule,
  TaskLocal,
  FORMAT,
} from '@midwayjs/decorator';
import { BaseSysLogService } from '../service/sys/log';
import { ILogger } from '@midwayjs/logger';

/**
 * 日志定时任务
 */
@Provide()
export class BaseLogSchedule implements CommonSchedule {
  @Inject()
  baseSysLogService: BaseSysLogService;

  @Inject()
  logger: ILogger;

  // 定时执行的具体任务
  @TaskLocal(FORMAT.CRONTAB.EVERY_DAY)
  async exec() {
    this.logger.info('清除日志定时任务开始执行');
    const startTime = Date.now();
    await this.baseSysLogService.clear();
    this.logger.info(`清除日志定时任务结束，耗时:${Date.now() - startTime}ms`);
  }
}
