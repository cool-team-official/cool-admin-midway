import { COOL_CACHE } from "./cache";
import { CacheManager } from "@midwayjs/cache";
import {
  Init,
  Inject,
  JoinPoint,
  MidwayDecoratorService,
  Provide,
  Scope,
  ScopeEnum,
} from "@midwayjs/core";
import { TypeORMDataSourceManager } from "@midwayjs/typeorm";
import { CoolCommException } from "../exception/comm";
import { COOL_TRANSACTION, TransactionOptions } from "./transaction";
import * as md5 from "md5";

/**
 * 装饰器
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolDecorator {
  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  @Inject()
  decoratorService: MidwayDecoratorService;

  @Inject()
  cacheManager: CacheManager;

  @Init()
  async init() {
    // 事务
    await this.transaction();
    // 缓存
    await this.cache();
  }

  /**
   * 缓存
   */
  async cache() {
    this.decoratorService.registerMethodHandler(COOL_CACHE, (options) => {
      return {
        around: async (joinPoint: JoinPoint) => {
          const key = md5(
            joinPoint.target.constructor.name +
              joinPoint.methodName +
              JSON.stringify(joinPoint.args)
          );
          // 缓存有数据就返回
          let data: any = await this.cacheManager.get(key);
          if (data) {
            return JSON.parse(data);
          } else {
            // 执行原始方法
            data = await joinPoint.proceed(...joinPoint.args);
            await this.cacheManager.set(key, JSON.stringify(data), {
              ttl: options.metadata.ttl,
            });
          }
          return data;
        },
      };
    });
  }

  /**
   * 事务
   */
  async transaction() {
    this.decoratorService.registerMethodHandler(COOL_TRANSACTION, (options) => {
      return {
        around: async (joinPoint: JoinPoint) => {
          const option: TransactionOptions = options.metadata;
          const dataSource = this.typeORMDataSourceManager.getDataSource(
            option?.connectionName || "default"
          );
          const queryRunner = dataSource.createQueryRunner();
          await queryRunner.connect();
          if (option && option.isolation) {
            await queryRunner.startTransaction(option.isolation);
          } else {
            await queryRunner.startTransaction();
          }
          let data;
          try {
            joinPoint.args.push(queryRunner);
            data = await joinPoint.proceed(...joinPoint.args);
            await queryRunner.commitTransaction();
          } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new CoolCommException(error.message);
          } finally {
            await queryRunner.release();
          }
          return data;
        },
      };
    });
  }
}
