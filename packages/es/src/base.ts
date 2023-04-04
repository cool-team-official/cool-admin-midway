import { CoolEventManager } from '@cool-midway/core';
import { Client } from '@elastic/elasticsearch';
import { WaitForActiveShards } from '@elastic/elasticsearch/lib/api/types';
import { Inject, Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { EsConfig } from '.';

/**
 * Es索引基类
 */
export class BaseEsIndex {
  // 索引
  public index: string;
  // es客户端
  public client: Client;
  // 日志
  @Logger()
  coreLogger: ILogger;
  // 事件
  @Inject('cool:coolEventManager')
  coolEventManager: CoolEventManager;

  /**
   * 设置索引
   * @param index
   */
  setIndex(index: string) {
    this.index = index;
  }

  /**
   * 处理es数据变更事件，主要用于同步数据
   * @param method
   * @param data
   */
  async handleDataChange(index, method, data) {
    this.index = index;
    const {
      id,
      ids,
      bodys,
      body,
      type,
      refresh,
      waitForActiveShards,
      properties,
      config,
    } = data;
    switch (method) {
      case 'upsert':
        await this.upsert(body, refresh, waitForActiveShards);
        break;
      case 'batchIndex':
        await this.batchIndex(bodys, type, refresh, waitForActiveShards);
        break;
      case 'deleteById':
        await this.deleteById(id, refresh, waitForActiveShards);
        break;
      case 'deleteByIds':
        await this.deleteByIds(ids, refresh, waitForActiveShards);
        break;
      case 'deleteByQuery':
        await this.deleteByQuery(body, refresh, waitForActiveShards);
        break;
      case 'updateById':
        await this.updateById(body, refresh, waitForActiveShards);
        break;
      case 'updateByQuery':
        await this.updateByQuery(body, refresh, waitForActiveShards);
        break;
      case 'createIndex':
        await this.updateByQuery(properties, config);
        break;
    }
  }

  /**
   * 数据更新事件
   * @param method
   * @param data
   */
  async esDataChange(method, data) {
    this.coolEventManager?.emit('esDataChange', this.index, method, data);
  }

  /**
   *
   * @param client
   */
  setClient(client: Client) {
    this.client = client;
  }

  /**
   * 查询
   * @param body
   */
  async find(body?: any, size?: number) {
    if (!body) {
      body = {};
    }
    body.size = size ? size : 10000;
    return this.client
      .search({
        index: this.index,
        body,
      })
      .then(res => {
        return (
          res.hits.hits.map(e => {
            e._source['id'] = e._id;
            const _source: any = e._source;
            ['_id', '_index', '_score', '_source'].forEach(key => {
              delete e[key];
            });
            return {
              ..._source,
              ...e,
            };
          }) || []
        );
      });
  }

  /**
   * 分页查询
   * @param body
   * @param page
   * @param size
   */
  async findPage(body?: any, page?: number, size?: number) {
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 20;
    }
    if (!body) {
      body = {};
    }
    const total = await this.findCount(body);
    body.from = (page - 1) * size;
    body.size = size;
    return this.client.search({ index: this.index, body }).then(res => {
      const result =
        res.hits.hits.map(e => {
          e._source['id'] = e._id;
          const _source: any = e._source;
          ['_id', '_index', '_score', '_source'].forEach(key => {
            delete e[key];
          });
          return {
            ..._source,
            ...e,
          };
        }) || [];
      return {
        list: result,
        pagination: {
          page,
          size,
          total,
        },
      };
    });
  }

  /**
   * 根据ID查询
   * @param id
   * @returns
   */
  async findById(id) {
    return this.client
      .get({
        index: this.index,
        id,
      })
      .then(res => {
        res._source['id'] = res._id;
        return res._source || undefined;
      })
      .catch(e => {
        return undefined;
      });
  }

  /**
   * 根据多个ID查询
   * @param ids
   * @returns
   */
  async findByIds(ids: string[]) {
    return this.client
      .mget({ index: this.index, body: { ids } })
      .then(res => {
        const result = res.docs.map((e: any) => {
          e._source.id = e._id;
          return e._source || 'undefined';
        });
        return result.filter(e => {
          return e !== 'undefined';
        });
      })
      .catch(e => {
        return undefined;
      });
  }

  /**
   * 插入与更新
   * @param body
   * @param refresh
   * @param waitForActiveShards
   * @returns
   */
  async upsert(
    body: any,
    refresh?: boolean | 'wait_for',
    waitForActiveShards?: WaitForActiveShards
  ) {
    if (refresh == undefined) {
      refresh = true;
    }
    if (body.id) {
      this.esDataChange('upsert', {
        body,
        refresh,
        waitForActiveShards,
      });
      const id = body.id;
      delete body.id;
      return this.client.index({
        id,
        index: this.index,
        wait_for_active_shards: waitForActiveShards,
        refresh,
        body,
      });
    } else {
      return this.client
        .index({
          index: this.index,
          wait_for_active_shards: waitForActiveShards,
          refresh,
          body,
        })
        .then(res => {
          this.esDataChange('upsert', {
            body: {
              ...body,
              id: res._id,
            },
            refresh,
            waitForActiveShards,
          });
          return res;
        });
    }
  }

  /**
   * 批量插入更新
   * @param bodys
   * @param type
   * @param refresh
   * @param waitForActiveShards
   * @returns
   */
  async batchIndex(
    bodys: any[],
    type: 'index' | 'create' | 'delete' | 'update',
    refresh?: boolean | 'wait_for',
    waitForActiveShards?: WaitForActiveShards
  ) {
    this.esDataChange('batchIndex', {
      bodys,
      type,
      refresh,
      waitForActiveShards,
    });
    if (refresh == undefined) {
      refresh = true;
    }
    const list = [];
    for (const body of bodys) {
      const typeO = {};
      typeO[type] = { _index: this.index, _id: body.id };
      if (body.id) {
        delete body.id;
      }
      list.push(typeO);
      if (type !== 'delete') {
        if (type == 'update') {
          list.push({ doc: body });
        } else {
          list.push(body);
        }
      }
    }
    return this.client.bulk({
      wait_for_active_shards: waitForActiveShards,
      index: this.index,
      refresh,
      body: list,
    });
  }

  /**
   * 删除索引
   * @param id
   * @param refresh
   * @param waitForActiveShards
   * @returns
   */
  async deleteById(
    id,
    refresh?: boolean | 'wait_for',
    waitForActiveShards?: WaitForActiveShards
  ) {
    this.esDataChange('deleteById', {
      id,
      refresh,
      waitForActiveShards,
    });
    if (refresh == undefined) {
      refresh = true;
    }
    try {
      return this.client.delete({
        index: this.index,
        refresh,
        wait_for_active_shards: waitForActiveShards,
        id,
      });
    } catch {}
  }

  /**
   * 删除文档
   * @param ids
   * @param refresh
   * @param waitForActiveShards
   * @returns
   */
  async deleteByIds(
    ids: string[],
    refresh?: boolean,
    waitForActiveShards?: WaitForActiveShards
  ) {
    this.esDataChange('deleteByIds', {
      ids,
      refresh,
      waitForActiveShards,
    });
    if (refresh == undefined) {
      refresh = true;
    }
    const body = {
      query: {
        bool: {
          must: [
            {
              terms: {
                _id: ids,
              },
            },
          ],
        },
      },
    };
    return this.client.deleteByQuery({
      index: this.index,
      refresh,
      wait_for_active_shards: waitForActiveShards,
      body,
    });
  }

  /**
   * 根据条件批量删除
   * @param body
   * @param refresh
   * @param waitForActiveShards
   * @returns
   */
  async deleteByQuery(
    body,
    refresh?: boolean,
    waitForActiveShards?: WaitForActiveShards
  ) {
    this.esDataChange('deleteByQuery', {
      body,
      refresh,
      waitForActiveShards,
    });
    if (refresh == undefined) {
      refresh = true;
    }
    return this.client.deleteByQuery({
      index: this.index,
      refresh,
      wait_for_active_shards: waitForActiveShards,
      body,
    });
  }

  /**
   * 更新索引
   * @param body
   * @param refresh
   * @param waitForActiveShards
   * @returns
   */
  async updateById(
    body,
    refresh?: boolean | 'wait_for',
    waitForActiveShards?: WaitForActiveShards
  ) {
    this.esDataChange('updateById', {
      body,
      refresh,
      waitForActiveShards,
    });
    if (refresh == undefined) {
      refresh = true;
    }
    const id = body.id;
    delete body.id;
    return this.client.update({
      wait_for_active_shards: waitForActiveShards,
      index: this.index,
      id: id,
      refresh,
      body: {
        doc: body,
      },
    });
  }

  /**
   * 根据条件更新
   * @param body
   * @param refresh
   * @param waitForActiveShards
   */
  async updateByQuery(
    body,
    refresh?: boolean,
    waitForActiveShards?: WaitForActiveShards
  ) {
    this.esDataChange('updateByQuery', {
      body,
      refresh,
      waitForActiveShards,
    });
    if (refresh == undefined) {
      refresh = true;
    }
    return this.client.updateByQuery({
      index: this.index,
      refresh,
      wait_for_active_shards: waitForActiveShards,
      body,
    });
  }

  /**
   * 查询条数
   * @param body
   */
  async findCount(body?: any) {
    let _body = Object.assign({}, body || {});
    delete _body.from;
    delete _body.size;
    delete _body.sort;
    return this.client
      .count({
        index: this.index,
        body: _body,
      })
      .then(res => {
        return res.count;
      })
      .catch(e => {
        return undefined;
      });
  }

  /**
   * 创建更新索引
   * @param config 配置
   */
  async createIndex(
    properties: {},
    config: EsConfig = {
      name: '',
      replicas: 1,
      shards: 8,
      analyzers: [],
    }
  ) {
    this.esDataChange('createIndex', {
      properties,
      config,
    });
    const body = {
      settings: {
        number_of_shards: config.shards,
        number_of_replicas: config.replicas,
        analysis: {
          analyzer: {
            comma: { type: 'pattern', pattern: ',' },
            blank: { type: 'pattern', pattern: ' ' },
          },
        },
        mapping: {
          nested_fields: {
            limit: 100,
          },
        },
      },
      mappings: {
        properties: {},
      },
    };
    if (config.analyzers) {
      for (const analyzer of config.analyzers) {
        for (const key in analyzer) {
          body.settings.analysis.analyzer[key] = analyzer[key];
        }
      }
    }
    const param = {
      index: this.index,
      body,
    };
    param.body = body;
    param.body.mappings.properties = properties;

    this.client.indices.exists({ index: this.index }).then(async res => {
      if (!res) {
        await this.client.indices.create(param).then(res => {
          if (res.acknowledged) {
            console.info(
              '\x1B[36m [cool:core] midwayjs cool elasticsearch ES索引创建成功: ' +
                this.index +
                ' \x1B[0m'
            );
          }
        });
      } else {
        const updateParam = {
          index: this.index,
          body: param.body.mappings,
        };
        await this.client.indices.putMapping(updateParam).then(res => {
          if (res.acknowledged) {
            console.info(
              '\x1B[36m [cool:core] midwayjs cool elasticsearch ES索引更新成功: ' +
                this.index +
                ' \x1B[0m'
            );
          }
        });
      }
    });
  }
}
