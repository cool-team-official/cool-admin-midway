import {
  Provide,
  getClassMetadata,
  App,
  Logger,
  Inject,
  Init,
  Scope,
  ScopeEnum,
  Config,
} from '@midwayjs/decorator';
import { COOL_ES_KEY, EsConfig } from './decorator/elasticsearch';
import { listModule } from '@midwayjs/decorator';
import { IMidwayApplication } from '@midwayjs/core';
import { CoolCoreException, CoolEventManager } from '@cool-midway/core';
import { ILogger } from '@midwayjs/logger';
import { Client } from '@elastic/elasticsearch';
import * as _ from 'lodash';
import { CoolEsConfig, ICoolEs } from '.';

/**
 * 搜索引擎
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolElasticSearch {
  @App()
  app: IMidwayApplication;

  @Logger()
  coreLogger: ILogger;

  @Config('cool.es')
  esConfig: CoolEsConfig;

  client: Client;

  @Inject('cool:coolEventManager')
  coolEventManager: CoolEventManager;

  @Init()
  async init() {
    if (!this.esConfig?.nodes) {
      throw new CoolCoreException('es.nodes config is require');
    }
    if (this.esConfig.nodes.length == 1) {
      this.client = new Client({ node: this.esConfig.nodes[0] });
    } else {
      this.client = new Client({ nodes: this.esConfig.nodes });
    }
    this.client.ping({}, { requestTimeout: 30000 }).then(res => {
      if (res) {
        this.coolEventManager.emit('esReady', this.client);
        this.scan();
      }
    });
  }

  async scan() {
    const modules = listModule(COOL_ES_KEY);
    for (let module of modules) {
      const cls: ICoolEs = await this.app
        .getApplicationContext()
        .getAsync(module);
      const data = getClassMetadata(COOL_ES_KEY, module);
      this.createIndex(cls, data);
    }
  }

  /**
   * 数据更新事件
   * @param method
   * @param data
   */
  async esDataChange(method, data) {
    //this.coolEventManager.emit('esDataChange', { method, data });
  }

  /**
   * 创建索引
   * @param cls
   * @param config
   */
  async createIndex(cls, config: EsConfig) {
    cls.index = config.name;
    cls.client = this.client;
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
      index: config.name,
      body,
    };
    param.body = body;
    param.body.mappings.properties = cls.indexInfo();

    this.esDataChange('createIndex', {
      properties: param.body.mappings.properties,
      config,
    });

    this.client.indices.exists({ index: config.name }).then(async res => {
      if (!res) {
        await this.client.indices.create(param).then(res => {
          if (res.acknowledged) {
            this.coreLogger.info(
              '\x1B[36m [cool:core] midwayjs cool elasticsearch ES索引创建成功: ' +
                config.name +
                ' \x1B[0m'
            );
          }
        });
      } else {
        const updateParam = {
          index: config.name,
          body: param.body.mappings,
        };
        await this.client.indices.putMapping(updateParam).then(res => {
          if (res.acknowledged) {
            this.coreLogger.info(
              '\x1B[36m [cool:core] midwayjs cool elasticsearch ES索引更新成功: ' +
                config.name +
                ' \x1B[0m'
            );
          }
        });
      }
    });
  }
}
