import { Provide, Scope, ScopeEnum } from '@midwayjs/core';

/**
 * 云函数
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolCloudFunc {
  /**
   * 获得类名
   * @param code
   * @returns
   */
  getClassName(code: string) {
    return code.match('class(.*)extends')[1].replace(/\s*/g, '');
  }
}
