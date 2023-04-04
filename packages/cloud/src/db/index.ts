import { CoolCommException } from '@cool-midway/core';
import { CoolDataSource } from './source';
import {
  ALL,
  Config,
  ILogger,
  Init,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { Repository } from 'typeorm';
import * as ts from 'typescript';
import * as _ from 'lodash';
/**
 * 数据库
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolCloudDb {
  @Logger()
  coreLogger: ILogger;

  coolDataSource: CoolDataSource;

  @Config(ALL)
  config;

  @Init()
  async init() {
    const config = this.config.typeorm.dataSource.default;
    if (!config) {
      throw new CoolCommException('未配置数据库default信息');
    }
    this.coolDataSource = new CoolDataSource({
      ...this.config.typeorm.dataSource.default,
      entities: [],
    });
    // 连接数据库
    await this.coolDataSource.initialize();
  }

  /**
   * 获得数据库操作实例
   * @param tableClass 表类
   * @param appId 应用ID
   * @returns
   */
  getRepository(tableClass: string, appId = 'CLOUD'): Repository<any> {
    return this.coolDataSource.getRepository(`${tableClass}${appId}`);
  }

  /**
   * 创建表
   * @param table 表结构，元函数，字符串
   * @param appId 应用ID，确保每个应用的数据隔离
   * @param synchronize 是否同步表结构
   */
  async createTable(table: string, synchronize = false, appId = 'CLOUD') {
    if (!table || !appId) {
      throw new CoolCommException('table、appId不能为空');
    }
    const { newCode, className } = this.parseCode(table, appId);
    const entities = this.coolDataSource.options.entities;
    // @ts-ignore
    this.coolDataSource.options.entities = _.dropWhile(entities, {
      name: className,
    });
    const code = ts.transpile(
      `${newCode}
        this.coolDataSource.options.entities.push(${className})

        this.coolDataSource.buildMetadatas().then(() => {
            if(synchronize){
               this.coolDataSource.synchronize();
            }
        });
        `,
      {
        emitDecoratorMetadata: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2018,
        removeComments: true,
      }
    );
    eval(code);
  }

  /**
   * 根据字符串查找并生成一个跟appId相关的类名
   * @param code 代码
   * @param appId
   */
  parseCode(code: string, appId = 'CLOUD') {
    try {
      const oldClassName = code
        .match('class(.*)extends')[1]
        .replace(/\s*/g, '');
      const oldTableStart = code.indexOf('@Entity(');
      const oldTableEnd = code.indexOf(')');

      const oldTableName = code
        .substring(oldTableStart + 9, oldTableEnd - 1)
        .replace(/\s*/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/\"/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/\'/g, '');
      const className = `${oldClassName}${appId}`;
      return {
        newCode: code
          .replace(oldClassName, className)
          .replace(oldTableName, `func_${oldTableName}`),
        className,
        tableName: `func_${oldTableName}`,
      };
    } catch (err) {
      this.coreLogger.error(err);
      throw new CoolCommException('代码结构不正确，请检查');
    }
  }
}
