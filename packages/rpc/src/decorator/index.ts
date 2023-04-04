import { CoolCommException } from '@cool-midway/core';
import {
  Provide,
  Scope,
  ScopeEnum,
  JoinPoint,
  Init,
  MidwayDecoratorService,
  Inject,
} from '@midwayjs/core';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { COOL_RPC_TRANSACTION, TransactionOptions } from './transaction';
import { v1 as uuid } from 'uuid';

/**
 * 装饰器
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolRpcDecorator {
  @Inject()
  decoratorService: MidwayDecoratorService;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  @Init()
  async init() {
    // 事务
    await this.transaction();
  }

  /**
   * 事务
   */
  async transaction() {
    this.decoratorService.registerMethodHandler(
      COOL_RPC_TRANSACTION,
      options => {
        return {
          around: async (joinPoint: JoinPoint) => {
            const option: TransactionOptions = options.metadata;
            let isCaller = false;
            let rpcTransactionId;
            if (joinPoint.args[0]) {
              isCaller = false;
              rpcTransactionId = joinPoint.args[0].rpcTransactionId;
            }
            // 如果没有事务ID，手动创建
            if (!rpcTransactionId) {
              isCaller = true;
              rpcTransactionId = uuid();
            }

            let data;
            const dataSource = this.typeORMDataSourceManager.getDataSource(
              option?.connectionName || 'default'
            );
            const queryRunner = dataSource.createQueryRunner();
            // 使用我们的新queryRunner建立真正的数据库连
            await queryRunner.connect();
            if (option && option.isolation) {
              await queryRunner.startTransaction(option.isolation);
            } else {
              await queryRunner.startTransaction();
            }

            try {
              global['moleculer.transactions'][rpcTransactionId] = queryRunner;
              // 半小时后清除
              setTimeout(() => {
                global['moleculer.transactions'][rpcTransactionId].release();
                delete global['moleculer.transactions'][rpcTransactionId];
              }, 1800 * 1000);
              joinPoint.args.push(rpcTransactionId);
              joinPoint.args.push(queryRunner);
              data = await joinPoint.proceed(...joinPoint.args);
              if (isCaller) {
                global['moleculer:broker'].broadcast('moleculer.transaction', {
                  rpcTransactionId,
                  commit: true,
                });
              }
              //await queryRunner.commitTransaction();
            } catch (error) {
              //await queryRunner.rollbackTransaction();
              if (isCaller) {
                global['moleculer:broker'].broadcast('moleculer.transaction', {
                  rpcTransactionId,
                  commit: false,
                });
              }
              throw new CoolCommException(error.message);
            }
            return data;
          },
        };
      }
    );
  }
}
