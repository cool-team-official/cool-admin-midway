import { Config, Init, Provide, App } from '@midwayjs/decorator';
import { Brackets } from 'typeorm';
import * as _ from 'lodash';
import { CoolValidateException, ERRINFO } from '@cool-midway/core';
import { QueryOp } from '../decorator/rpc';
import { IMidwayApplication, Inject } from '@midwayjs/core';
import * as SqlString from 'sqlstring';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';

/**
 * 服务基类
 */
@Provide()
export abstract class BaseRpcService {
  // 分页配置
  @Config('cool.page')
  private conf;

  // 模型
  protected entity;

  protected sqlParams;

  protected curdOption;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  // 设置模型
  setModel(entity: any) {
    this.entity = entity;
  }

  setCurdOption(curdOption) {
    this.curdOption = curdOption;
  }

  @App()
  app: IMidwayApplication;

  setApp(app) {
    this.app = app;
  }

  // 初始化
  @Init()
  init() {
    this.sqlParams = [];
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
   * 获得单个ID
   * @param params 参数
   */
  async info(params: any): Promise<any> {
    const { id } = params;
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    if (!id) {
      throw new CoolValidateException(ERRINFO.NOID);
    }
    const info = await this.entity.findOne({ id });
    if (info && this.curdOption.infoIgnoreProperty) {
      for (const property of this.curdOption.infoIgnoreProperty) {
        delete info[property];
      }
    }
    return info;
  }

  /**
   * 执行SQL并获得分页数据
   * @param sql 执行的sql语句
   * @param query 分页查询条件
   * @param autoSort 是否自动排序
   * @param connectionName 连接名称
   */
  async sqlRenderPage(sql, query, autoSort = false, connectionName?) {
    const {
      size = this.conf.size,
      page = 1,
      order = 'createTime',
      sort = 'desc',
      isExport = false,
      maxExportLimit,
    } = query;
    if (order && sort && !autoSort) {
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
    const result = await this.nativeQuery(sql, params, connectionName);
    const countResult = await this.nativeQuery(
      this.getCountSql(sql),
      params,
      connectionName
    );
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
   * 设置sql
   * @param condition 条件是否成立
   * @param sql sql语句
   * @param params 参数
   */
  setSql(condition, sql, params) {
    let rSql = false;
    if (condition || (condition === 0 && condition !== '')) {
      rSql = true;
      this.sqlParams = this.sqlParams.concat(params);
    }
    return rSql ? sql : '';
  }

  /**
   * 获得查询个数的SQL
   * @param sql
   */
  getCountSql(sql) {
    sql = sql.replace('LIMIT ', 'limit ');
    return `select count(*) as count from (${
      sql.replace(new RegExp('\n', 'gm'), ' ').split('limit ')[0]
    }) a`;
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
   * 原生查询
   * @param sql
   * @param params
   * @param connectionName
   */
  async nativeQuery(sql, params?, connectionName?) {
    if (_.isEmpty(params)) {
      params = this.sqlParams;
    }
    let newParams = [];
    newParams = newParams.concat(params);
    this.sqlParams = [];
    return await this.getOrmManager(connectionName).query(sql, newParams || []);
  }

  /**
   * 获得ORM管理
   *  @param connectionName 连接名称
   */
  getOrmManager(connectionName = 'default') {
    return this.typeORMDataSourceManager.getDataSource(connectionName);
  }

  /**
   * 非分页查询
   * @param params 查询条件
   */
  async list(params?): Promise<any> {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    const sql = await this.getOptionFind(params, this.curdOption.listQueryOp);
    return this.nativeQuery(sql, []);
  }

  /**
   * 删除
   * @param params 参数
   */
  async delete(params: any | string) {
    const { ids } = params;
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    if (ids instanceof Array) {
      await this.entity.delete(ids);
    } else {
      await this.entity.delete(ids.split(','));
    }
    await this.modifyAfter(ids);
  }

  /**
   * 新增|修改
   * @param params 数据
   */
  async addOrUpdate(params: any) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    await this.entity.save(params);
  }

  /**
   * 新增
   * @param param 数据
   */
  async add(params: any): Promise<Object> {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    await this.addOrUpdate(params);
    await this.modifyAfter(params);
    return {
      id: params.id,
    };
  }

  /**
   * 修改
   * @param param 数据
   */
  async update(params: any) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    if (!params.id) throw new CoolValidateException(ERRINFO.NOID);
    await this.addOrUpdate(params);
    await this.modifyAfter(params);
  }

  /**
   * 新增|修改|删除 之后的操作
   * @param data 对应数据
   */
  async modifyAfter(data: any): Promise<void> {}

  /**
   * 分页查询
   * @param params 查询条件
   */
  async page(params?) {
    if (!this.entity) throw new CoolValidateException(ERRINFO.NOENTITY);
    const sql = await this.getOptionFind(params, this.curdOption.pageQueryOp);
    return this.sqlRenderPage(sql, params, true);
  }

  /**
   * query
   * @param data
   * @param query
   */
  renderPage(data, query) {
    const { size = this.conf.size, page = 1 } = query;
    return {
      list: data[0],
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total: data[1],
      },
    };
  }

  /**
   * 构建查询配置
   * @param query 前端查询
   * @param option
   */
  private async getOptionFind(query, option: QueryOp) {
    let { order = 'createTime', sort = 'desc', keyWord = '' } = query || {};
    let sqlArr = ['SELECT'];
    let selects = ['a.*'];
    let find = this.entity.createQueryBuilder('a');
    if (option) {
      // 判断是否有关联查询，有的话取个别名
      if (!_.isEmpty(option.leftJoin)) {
        for (const item of option.leftJoin) {
          selects.push(`${item.alias}.*`);
          find.leftJoin(item.entity, item.alias, item.condition);
        }
      }
      // 默认条件
      if (option.where) {
        const wheres = await option.where(query, this.app);
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
          find.addOrderBy(
            SqlString.escapeId(key),
            this.checkSort(option.addOrderBy[key].toUpperCase())
          );
        }
      }
      // 关键字模糊搜索
      if (keyWord) {
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
            if (query[key] || query[key] == 0) {
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
            if (query[key.column] || query[key.column] == 0) {
              c[key.column] = query[key.column];
              const eq = query[key.column] instanceof Array ? 'in' : '=';
              if (eq === 'in') {
                find.andWhere(`${key.column} ${eq} (:${key.column})`, c);
              } else {
                find.andWhere(`${key.column} ${eq} :${key.column}`, c);
              }
              this.sqlParams.push(query[key.column]);
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
    const sqls = find.getSql().split('FROM');
    sqlArr.push('FROM');
    sqlArr.push(sqls[1]);
    return sqlArr.join(' ');
  }
}
