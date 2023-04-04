import { RESCODE } from './../constant/global';
import { ILogger } from '@midwayjs/core';
import { Catch, Logger } from '@midwayjs/decorator';

/**
 * 全局异常处理
 */
@Catch()
export class CoolExceptionFilter {
  @Logger()
  coreLogger: ILogger;

  async catch(err) {
    this.coreLogger.error(err);
    return {
      code: err.status || RESCODE.COMMFAIL,
      message: err.message,
    };
  }
}
