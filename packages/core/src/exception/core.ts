import { RESCODE, RESMESSAGE } from '../constant/global';
import { BaseException } from './base';

/**
 * 核心异常
 */
export class CoolCoreException extends BaseException {
  constructor(message: string) {
    super(
      'CoolCoreException',
      RESCODE.COREFAIL,
      message ? message : RESMESSAGE.COREFAIL
    );
  }
}
