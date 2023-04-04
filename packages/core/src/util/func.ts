import { ILogger } from '@midwayjs/core';
import { Init, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as moment from 'moment';

/**
 * 常用函数处理
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class FuncUtil {
  @Logger()
  coreLogger: ILogger;

  @Init()
  async init() {
    Date.prototype.toJSON = function () {
      return moment(this).format('YYYY-MM-DD HH:mm:ss');
    };
    // 新增String支持replaceAll方法
    String.prototype['replaceAll'] = function (s1, s2) {
      return this.replace(new RegExp(s1, 'gm'), s2);
    };
    this.coreLogger.info(
      '\x1B[36m [cool:core] midwayjs cool core func handler \x1B[0m'
    );
  }
}
