import { RESCODE, RESMESSAGE } from '../constant/global';
import { BaseException } from './base';

/**
 * 校验异常
 */
export class CoolValidateException extends BaseException {
  constructor(message: string) {
    super(
      'CoolValidateException',
      RESCODE.VALIDATEFAIL,
      message ? message : RESMESSAGE.VALIDATEFAIL
    );
  }
}
