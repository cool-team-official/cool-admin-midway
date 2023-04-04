import { CloudReq } from './../interface';
import { IMidwayApplication } from '@midwayjs/core';
import {
  CoolConfig,
  CoolEventManager,
  CoolValidateException,
  CurdOption,
  ERRINFO,
  EVENT,
} from '@cool-midway/core';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { CoolCloudDb } from '../db';
import * as _ from 'lodash';
import * as SqlString from 'sqlstring';

export abstract class CloudCrud {
  ctx;

  curdOption: CurdOption;

  coolCloudDb: CoolCloudDb;

  coolConfig: CoolConfig;

  entity: Repository<any>;

  app: IMidwayApplication;

  req: CloudReq;

  coolEventManager: CoolEventManager;

  protected sqlParams;

  setCurdOption(curdOption: CurdOption) {
    this.curdOption = curdOption;
  }

  /**
   * 设置实体
   * @param entityModel
   */
  async setEntity() {
    this.entity = this.coolCloudDb.getRepository(
      this.curdOption.entity,
      'CLOUD'
    );
  }

  abstract main(req: CloudReq): Promise<void>;

  async init(req: CloudReq) {
    this.sqlParams = [];
    // 执行主函数
    await this.main(req);
    // 操作之前
    await this.before();
    // // 设置实体
    await this.setEntity();
  }

  /**
   * 参数安全性检查
   * @param params
   */
  async paramSafetyCheck(params) {
    const lp = params.toLowerCase();
    return !(
      lp.indexOf('update ') > -1 ||
      lp.indexOf('select ') > -1 ||
      lp.indexOf('delete ') > -1 ||
      lp.indexOf('insert ') > -1
    );
  }

  /**
   * 非分页查询
   * @param query 查询条件
   * @param option 查询配置
   */
  async list(query): Promise<any> {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    const sql = await this.getOptionFind(query, this.curdOption.listQueryOp);
    return this.nativeQuery(sql, []);
  }

  /**
   * 执行SQL并获得分页数据
   * @param sql 执行的sql语句
   * @param query 分页查询条件
   * @param autoSort 是否自动排序
   */
  async sqlRenderPage(sql, query, autoSort = true) {
    const {
      size = this.coolConfig.crud.pageSize,
      page = 1,
      order = 'createTime',
      sort = 'desc',
      isExport = false,
      maxExportLimit,
    } = query;
    if (order && sort && autoSort) {
      if (!(await this.paramSafetyCheck(order + sort))) {
        throw new CoolValidateException('非法传参~');
      }
      sql += ` ORDER BY ${SqlString.escapeId(order)} ${this.checkSort(sort)}`;
    }
    if (isExport && maxExportLimit > 0) {
      this.sqlParams.push(parseInt(maxExportLimit));
      sql += ' LIMIT ? ';
    }
    if (!isExport) {
      this.sqlParams.push((page - 1) * size);
      this.sqlParams.push(parseInt(size));
      sql += ' LIMIT ?,? ';
    }

    let params = [];
    params = params.concat(this.sqlParams);
    const result = await this.nativeQuery(sql, params);
    const countResult = await this.nativeQuery(this.getCountSql(sql), params);
    return {
      list: result,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total: parseInt(countResult[0] ? countResult[0].count : 0),
      },
    };
  }

  /**
   * 分页查询
   * @param connectionName 连接名
   */
  async page(query) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    const sql = await this.getOptionFind(query, this.curdOption.pageQueryOp);
    return this.sqlRenderPage(sql, query, false);
  }

  /**
   * 获得查询个数的SQL
   * @param sql
   */
  getCountSql(sql) {
    sql = sql
      .replace(new RegExp('LIMIT', 'gm'), 'limit ')
      .replace(new RegExp('\n', 'gm'), ' ');
    if (sql.includes('limit')) {
      const sqlArr = sql.split('limit ');
      sqlArr.pop();
      sql = sqlArr.join('limit ');
    }
    return `select count(*) as count from (${sql}) a`;
  }

  /**
   * 操作entity获得分页数据，不用写sql
   * @param find QueryBuilder
   * @param query
   * @param autoSort
   * @param connectionName
   */
  async entityRenderPage(
    find: SelectQueryBuilder<any>,
    query,
    autoSort = true
  ) {
    const {
      size = this.coolConfig.crud.pageSize,
      page = 1,
      order = 'createTime',
      sort = 'desc',
      isExport = false,
      maxExportLimit,
    } = query;
    const count = await find.getCount();
    let dataFind: SelectQueryBuilder<any>;
    if (isExport && maxExportLimit > 0) {
      dataFind = find.limit(maxExportLimit);
    } else {
      dataFind = find.offset((page - 1) * size).limit(size);
    }
    if (autoSort) {
      find.addOrderBy(order, sort.toUpperCase());
    }
    return {
      list: await dataFind.getRawMany(),
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total: count,
      },
    };
  }

  /**
   * 检查排序
   * @param sort 排序
   * @returns
   */
  private checkSort(sort) {
    if (!['desc', 'asc'].includes(sort.toLowerCase())) {
      throw new CoolValidateException('sort 非法传参~');
    }
    return sort;
  }

  /**
   * 原生查询
   * @param sql
   * @param params
   */
  async nativeQuery(sql, params?) {
    if (_.isEmpty(params)) {
      params = this.sqlParams;
    }
    let newParams = [];
    newParams = newParams.concat(params);
    this.sqlParams = [];
    for (const param of newParams) {
      SqlString.escape(param);
    }
    return await this.getOrmManager().query(sql, newParams || []);
  }

  /**
   * 获得ORM管理
   *  @param connectionName 连接名称
   */
  getOrmManager() {
    return this.coolCloudDb.coolDataSource;
  }

  private async before() {
    if (!this.curdOption?.before) {
      return;
    }
    await this.curdOption.before(this.ctx, this.app);
  }

  /**
   * 插入参数值
   * @param curdOption 配置
   */
  private async insertParam(param) {
    if (!this.curdOption?.insertParam) {
      return param;
    }
    return {
      ...param,
      ...(await this.curdOption.insertParam(this.ctx, this.app)),
    };
  }

  /**
   * 新增|修改|删除 之后的操作
   * @param data 对应数据
   */
  async modifyAfter(
    data: any,
    type: 'delete' | 'update' | 'add'
  ): Promise<void> {}

  /**
   * 新增|修改|删除 之前的操作
   * @param data 对应数据
   */
  async modifyBefore(
    data: any,
    type: 'delete' | 'update' | 'add'
  ): Promise<void> {}

  /**
   * 新增
   * @param param
   * @returns
   */
  async add(param) {
    param = await this.insertParam(param);
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    await this.modifyBefore(param, 'add');
    await this.addOrUpdate(param);
    await this.modifyAfter(param, 'add');
    return {
      id:
        param instanceof Array
          ? param.map(e => {
              return e.id ? e.id : e._id;
            })
          : param.id
          ? param.id
          : param._id,
    };
  }

  /**
   * 新增|修改
   * @param param 数据
   */
  async addOrUpdate(param: any | any[]) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    delete param.createTime;
    if (param.id) {
      param.updateTime = new Date();
      await this.entity.update(param.id, param);
    } else {
      param.createTime = new Date();
      param.updateTime = new Date();
      await this.entity.insert(param);
    }
  }

  /**
   * 删除
   * @param ids 删除的ID集合 如：[1,2,3] 或者 1,2,3
   */
  async delete(ids: any) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    await this.modifyBefore(ids, 'delete');
    if (ids instanceof String) {
      ids = ids.split(',');
    }
    if (this.coolConfig.crud?.softDelete) {
      this.softDelete(ids);
    }
    await this.entity.delete(ids);
    await this.modifyAfter(ids, 'delete');
  }

  /**
   * 软删除
   * @param ids 删除的ID数组
   * @param entity 实体
   */
  async softDelete(ids: string[], entity?: Repository<any>, userId?: string) {
    const data = await this.entity.find({
      where: {
        id: In(ids),
      },
    });
    if (_.isEmpty(data)) return;
    const _entity = entity ? entity : this.entity;
    const params = {
      data,
      ctx: this.ctx,
      entity: _entity,
    };
    if (data.length > 0) {
      this.coolEventManager.emit(EVENT.SOFT_DELETE, params);
    }
  }

  /**
   * 修改
   * @param param 数据
   */
  async update(param: any) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    await this.modifyBefore(param, 'update');
    if (!param.id && !(param instanceof Array))
      throw new CoolValidateException(ERRINFO.NOID);
    await this.addOrUpdate(param);
    await this.modifyAfter(param, 'update');
  }

  /**
   * 获得单个ID
   * @param id ID
   */
  async info(id: any): Promise<any> {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    if (!id) {
      throw new CoolValidateException(ERRINFO.NOID);
    }
    const info = await this.entity.findBy({ id });
    if (info && this.curdOption?.infoIgnoreProperty) {
      for (const property of this.curdOption?.infoIgnoreProperty) {
        delete info[property];
      }
    }
    return info;
  }

  /**
   * 构建查询配置
   * @param query 前端查询
   * @param option
   */
  private async getOptionFind(query, option) {
    let { order = 'createTime', sort = 'desc', keyWord = '' } = query;
    const sqlArr = ['SELECT'];
    const selects = ['a.*'];
    const find = this.entity.createQueryBuilder('a');
    if (option) {
      if (typeof option == 'function') {
        // @ts-ignore
        option = await option(this.baseCtx, this.baseApp);
      }
      // 判断是否有关联查询，有的话取个别名
      if (!_.isEmpty(option.join)) {
        for (const item of option.join) {
          selects.push(`${item.alias}.*`);
          find[item.type || 'leftJoin'](
            item.entity,
            item.alias,
            item.condition
          );
        }
      }
      // 默认条件
      if (option.where) {
        const wheres =
          typeof option.where == 'function'
            ? await option.where(this.ctx, this.app)
            : option.where;
        if (!_.isEmpty(wheres)) {
          for (const item of wheres) {
            if (
              item.length == 2 ||
              (item.length == 3 &&
                (item[2] || (item[2] === 0 && item[2] != '')))
            ) {
              for (const key in item[1]) {
                this.sqlParams.push(item[1][key]);
              }
              find.andWhere(item[0], item[1]);
            }
          }
        }
      }
      // 附加排序
      if (!_.isEmpty(option.addOrderBy)) {
        for (const key in option.addOrderBy) {
          if (order && order == key) {
            sort = option.addOrderBy[key].toUpperCase();
          }
          find.addOrderBy(
            SqlString.escapeId(key),
            this.checkSort(option.addOrderBy[key].toUpperCase())
          );
        }
      }
      // 关键字模糊搜索
      if (keyWord || (keyWord == 0 && keyWord != '')) {
        keyWord = `%${keyWord}%`;
        find.andWhere(
          new Brackets(qb => {
            const keyWordLikeFields = option.keyWordLikeFields;
            for (let i = 0; i < option.keyWordLikeFields?.length || 0; i++) {
              qb.orWhere(`${keyWordLikeFields[i]} like :keyWord`, {
                keyWord,
              });
              this.sqlParams.push(keyWord);
            }
          })
        );
      }
      // 筛选字段
      if (!_.isEmpty(option.select)) {
        sqlArr.push(option.select.join(','));
        find.select(option.select);
      } else {
        sqlArr.push(selects.join(','));
      }
      // 字段全匹配
      if (!_.isEmpty(option.fieldEq)) {
        for (const key of option.fieldEq) {
          const c = {};
          // 单表字段无别名的情况下操作
          if (typeof key === 'string') {
            if (query[key] || (query[key] == 0 && query[key] == '')) {
              c[key] = query[key];
              const eq = query[key] instanceof Array ? 'in' : '=';
              if (eq === 'in') {
                find.andWhere(`${key} ${eq} (:${key})`, c);
              } else {
                find.andWhere(`${key} ${eq} :${key}`, c);
              }
              this.sqlParams.push(query[key]);
            }
          } else {
            if (
              query[key.requestParam] ||
              (query[key.requestParam] == 0 && query[key.requestParam] !== '')
            ) {
              c[key.column] = query[key.requestParam];
              const eq = query[key.requestParam] instanceof Array ? 'in' : '=';
              if (eq === 'in') {
                find.andWhere(`${key.column} ${eq} (:${key.column})`, c);
              } else {
                find.andWhere(`${key.column} ${eq} :${key.column}`, c);
              }
              this.sqlParams.push(query[key.requestParam]);
            }
          }
        }
      }
    } else {
      sqlArr.push(selects.join(','));
    }
    // 接口请求的排序
    if (sort && order) {
      const sorts = sort.toUpperCase().split(',');
      const orders = order.split(',');
      if (sorts.length != orders.length) {
        throw new CoolValidateException(ERRINFO.SORTFIELD);
      }
      for (const i in sorts) {
        find.addOrderBy(
          SqlString.escapeId(orders[i]),
          this.checkSort(sorts[i])
        );
      }
    }
    if (option?.extend) {
      await option?.extend(find, this.ctx, this.app);
    }
    const sqls = find.getSql().split('FROM');
    sqlArr.push('FROM');
    sqlArr.push(sqls[1]);
    return sqlArr.join(' ');
  }
}
