import { Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { CoolRpcEvent, CoolRpcEventHandler } from '..';
import { ILogger } from '@midwayjs/logger';

/**
 * moleculer 事件处理
 */
@Provide()
@Scope(ScopeEnum.Singleton)
@CoolRpcEvent()
export class MoleculerTransactionHandler {
  @Logger()
  coreLogger: ILogger;

  /**
   * 注册事件
   * @param params
   */
  @CoolRpcEventHandler('moleculer.transaction') // 唯一参数，eventName，事件名，可不填，默认为方法名
  async handler(params) {
    const { rpcTransactionId, commit } = params;
    this.coreLogger.info(
      `\x1B[36m [cool:core] MoleculerTransaction event params: ${JSON.stringify(
        params
      )} \x1B[0m`
    );
    if (global['moleculer.transactions'][rpcTransactionId]) {
      this.coreLogger.info(
        `\x1B[36m [cool:core] MoleculerTransaction event ${
          commit ? 'commitTransaction' : 'rollbackTransaction'
        } ID: ${rpcTransactionId} \x1B[0m`
      );
      await global['moleculer.transactions'][rpcTransactionId][
        commit ? 'commitTransaction' : 'rollbackTransaction'
      ]();
      await global['moleculer.transactions'][rpcTransactionId].release();
      delete global['moleculer.transactions'][rpcTransactionId];
    }
  }
}
