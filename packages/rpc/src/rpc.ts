import { ILogger, IMidwayApplication, Inject } from '@midwayjs/core';
import {
  App,
  Config,
  getClassMetadata,
  listModule,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import { ServiceBroker } from 'moleculer';
import { CoolRpcConfig } from '.';
import { CoolCoreException, CoolValidateException } from '@cool-midway/core';
import { v1 as uuid } from 'uuid';
import { BaseRpcService } from './service/base';
import { CurdOption, MOLECYLER_KEY } from './decorator/rpc';
import { COOL_RPC_EVENT_KEY } from './decorator/event/event';
import { COOL_RPC_EVENT_HANDLER_KEY } from './decorator/event/handler';
import * as _ from 'lodash';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
// import { AgentService } from '@moleculer/lab';

/**
 * 微服务
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolRpc {
  broker: ServiceBroker;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  @Logger()
  coreLogger: ILogger;

  @Config('cool.rpc')
  rpcConfig: CoolRpcConfig;

  @Config('cool')
  coolConfig;

  @App()
  app: IMidwayApplication;

  cruds;

  async init() {
    if (!this.rpcConfig?.name) {
      throw new CoolCoreException(
        'cool.rpc.name config is require and every service name must be unique'
      );
    }

    let redisConfig;

    if (!this.rpcConfig?.redis && !this.coolConfig?.redis) {
      throw new CoolCoreException('cool.rpc.redis or cool.redis is require');
    }

    redisConfig = this.rpcConfig?.redis
      ? this.rpcConfig?.redis
      : this.coolConfig?.redis;

    const transporter = {
      type: 'Redis',
      options: {},
    };
    if (redisConfig instanceof Array) {
      transporter.options = {
        cluster: {
          nodes: redisConfig,
        },
      };
    } else {
      transporter.options = redisConfig;
    }

    this.broker = new ServiceBroker({
      nodeID: `${this.rpcConfig.name}-${uuid()}`,
      transporter,
      //   metrics: {
      //     enabled: true,
      //     reporter: 'Laboratory',
      //   },
      //   tracing: {
      //     enabled: true,
      //     exporter: 'Laboratory',
      //   },
      ...this.rpcConfig,
    });

    // this.broker.createService({
    //   name: this.rpcConfig.name,
    //   mixins: [],
    //   //   settings: {
    //   //     name: 'test',
    //   //     port: 3210,
    //   //     token: '123123',
    //   //     apiKey: '92C18ZR-ERM45EG-HT8GQGQ-4MHCXAT',
    //   //   },
    // });

    global['moleculer:broker'] = this.broker;

    await this.initService();
    await this.createService();
  }

  /**
   * 获得事件
   * @returns
   */
  async getEvents() {
    const allEvents = {};
    const modules = listModule(COOL_RPC_EVENT_KEY);
    for (const module of modules) {
      const moduleInstance = await this.app
        .getApplicationContext()
        .getAsync(module);
      moduleInstance['broker'] = this.broker;
      const events = getClassMetadata(COOL_RPC_EVENT_HANDLER_KEY, module);
      for (const event of events) {
        allEvents[event.eventName ? event.eventName : event.propertyKey] = {
          handler(ctx) {
            moduleInstance[event.propertyKey](ctx.params);
          },
        };
      }
    }
    return allEvents;
  }

  /**
   * 创建服务
   */
  async createService() {
    const _this = this;
    this.broker.createService({
      name: this.rpcConfig.name,
      events: await this.getEvents(),
      actions: {
        async call(ctx) {
          const { service, method, params } = ctx.params;
          const targetName = _.upperFirst(service);
          const target = _.find(_this.cruds, { name: targetName });
          if (!target) {
            throw new CoolValidateException('找不到服务');
          }
          const curdOption: CurdOption = getClassMetadata(
            MOLECYLER_KEY,
            target
          );

          const cls = await _this.app
            .getApplicationContext()
            .getAsync(_.lowerFirst(service));
          const serviceInstance: BaseRpcService = new target();
          Object.assign(serviceInstance, cls);
          serviceInstance.setModel(_this.getModel(curdOption));
          serviceInstance.setApp(_this.app);
          serviceInstance.init();

          // 如果是通用crud方法 注入参数
          if (
            ['add', 'delete', 'update', 'page', 'info', 'list'].includes(method)
          ) {
            if (!curdOption.method.includes(method)) {
              throw new CoolValidateException('方法不存在');
            }
          }
          return serviceInstance[method](params);
        },
      },
    });
    this.broker.start();
  }

  /**
   * 初始化service，设置entity
   */
  async initService() {
    // 获得所有的service
    this.cruds = listModule(MOLECYLER_KEY);
    for (const crud of this.cruds) {
      const curdOption: CurdOption = getClassMetadata(MOLECYLER_KEY, crud);
      const serviceInstance: BaseRpcService = await this.app
        .getApplicationContext()
        .getAsync(crud);
      serviceInstance.setModel(this.getModel(curdOption));
      serviceInstance.setCurdOption(curdOption);
    }
  }

  /**
   * 获得Model
   * @param curdOption
   */
  getModel(curdOption) {
    // 获得到model
    let entityModel;
    const { entity } = curdOption || {};
    if (entity) {
      const dataSourceName =
        this.typeORMDataSourceManager.getDataSourceNameByModel(entity);
      entityModel = this.typeORMDataSourceManager
        .getDataSource(dataSourceName)
        .getRepository(entity);
    }
    return entityModel;
  }

  /**
   * 调用服务
   * @param name 服务名称
   * @param controller 接口服务
   * @param method 方法
   * @param params 参数
   * @returns
   */
  async call(name: string, service: string, method: string, params?: {}) {
    return this.broker.call(`${name}.call`, { service, method, params });
  }

  /**
   * 发送事件
   * @param name 事件名称
   * @param params 事件参数
   * @param node 节点名称
   */
  async event(name: string, params: any, node?: string | string[]) {
    this.broker.emit(name, params);
  }

  /**
   * 发送广播事件
   * @param name
   * @param params
   * @param node 节点名称
   */
  async broadcastEvent(name: string, params: any, node?: string | string[]) {
    this.broker.broadcast(name, params);
  }

  /**
   * 发送本地广播事件
   * @param name
   * @param params
   * @param node 节点名称
   */
  async broadcastLocalEvent(
    name: string,
    params: any,
    node?: string | string[]
  ) {
    this.broker.broadcastLocal(name, params);
  }

  /**
   * 获得原始的broker对象
   * @returns
   */
  getBroker() {
    return this.broker;
  }

  /**
   * 停止
   */
  stop() {
    this.broker.stop();
  }
}
