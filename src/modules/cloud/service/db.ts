import { Config, Singleton } from '@midwayjs/core';
import { CloudDBEntity } from './../entity/db';
import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException, CoolConfig } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CoolCloudDb } from '@cool-midway/cloud';
import * as _ from 'lodash';

/**
 * 云数据库
 */
@Provide()
@Singleton()
export class CloudDBService extends BaseService {
  @InjectEntityModel(CloudDBEntity)
  cloudDBEntity: Repository<CloudDBEntity>;

  @Inject()
  coolCloudDb: CoolCloudDb;

  @Config('cool')
  coolConfig: CoolConfig;

  /**
   * 数据
   * @param id
   * @param method
   * @param params
   * @returns
   */
  async data(id, method, params: any = {}) {
    const db = await this.cloudDBEntity.findOneBy({ id });
    const repository = await this.getRepository(db?.className);
    if (method == 'add' || method == 'update') {
      await repository.save(params);
      return {
        id: params.id,
      };
    }
    if (method == 'delete') {
      await repository.delete(params.ids);
    }
    if (method == 'clear') {
      await repository.clear();
    }
    if (method == 'page') {
      const { page = 1, size = this.coolConfig.crud.pageSize } = params;
      const find = repository
        .createQueryBuilder()
        .offset((page - 1) * size)
        .limit(size)
        .orderBy('createTime', 'DESC');
      return {
        list: await find.getMany(),
        pagination: {
          page: parseInt(page),
          size: parseInt(size),
          total: await find.getCount(),
        },
      };
    }
  }

  /**
   * 获得数据操作实例
   * @param className
   */
  async getRepository(className: string): Promise<Repository<any>> {
    const info = await this.cloudDBEntity.findOneBy({
      className,
    });
    if (!info) {
      throw new CoolCommException('云数据表不存在');
    }
    return await this.coolCloudDb.getRepository(info.className);
  }

  /**
   * 新增
   * @param param
   * @returns
   */
  async addOrUpdate(param, type) {
    const { tableName, className } = this.coolCloudDb.parseCode(param.content);
    // 更新
    if (param.id) {
      const old = await this.cloudDBEntity.findOneBy({ id: param.id });
      if (tableName != old.tableName) {
        const check = await this.cloudDBEntity.findOneBy({ tableName });
        if (check) {
          throw new CoolCommException('已存在相同的表名');
        }
      }
      if (className != old.className) {
        const checkClass = await this.cloudDBEntity.findOneBy({ className });
        if (checkClass) {
          throw new CoolCommException('已存在相同的类名');
        }
      }
    } else {
      const check = await this.cloudDBEntity.findOneBy({ tableName });
      if (check) {
        throw new CoolCommException('已存在相同的表名');
      }
      const checkClass = await this.cloudDBEntity.findOneBy({ className });
      if (checkClass) {
        throw new CoolCommException('已存在相同的类名');
      }
    }
    await super.addOrUpdate(
      {
        ...param,
        tableName,
        className: className.replace('CLOUD', ''),
      },
      type
    );
  }

  /**
   * 初始化
   */
  async initEntity() {
    const tables = await this.cloudDBEntity.findBy({ status: 1 });
    const tableNames = [];
    for (const table of tables) {
      const parseData = this.coolCloudDb.parseCode(table.content);
      tableNames.push(parseData.tableName);
      await this.coolCloudDb.createTable(table.content, true);
    }
    // 所有云函数表
    const { database } = this.coolCloudDb.coolDataSource.options;
    const allTables = (
      await this.coolCloudDb.coolDataSource.query(
        `SELECT table_name from information_schema.columns where table_schema like '${database}' and table_name like 'func_%' group by table_name`
      )
    ).map(e => {
      return e.TABLE_NAME || e.table_name;
    });
    // 需要删除的云函数表
    const deleteTables = allTables.filter(e => {
      return !tableNames.includes(e);
    });
    if (!_.isEmpty(deleteTables)) {
      await this.coolCloudDb.coolDataSource.query(
        `drop table ${deleteTables.join(',')}`
      );
    }
  }

  async modifyAfter() {
    await this.initEntity();
  }
}
