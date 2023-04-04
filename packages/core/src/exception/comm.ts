import { RESCODE, RESMESSAGE } from '../constant/global';
import { BaseException } from './base';

/**
 * 通用异常
 */
export class CoolCommException extends BaseException {
  constructor(message: string) {
    super(
      'CoolCommException',
      RESCODE.COMMFAIL,
      message ? message : RESMESSAGE.COMMFAIL
    );
  }
}
