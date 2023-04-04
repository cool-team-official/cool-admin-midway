import { IMidwayApplication } from '@midwayjs/core';
import {
  ALL,
  App,
  Config,
  Init,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import * as fs from 'fs';
import { CoolCoreException } from '../exception/core';
import { ModuleConfig } from '../interface';
import * as _ from 'lodash';

/**
 * 模块配置
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolModuleConfig {
  @App()
  app: IMidwayApplication;

  @Config(ALL)
  allConfig;

  modules;

  @Init()
  async init() {
    let modules = [];
    // 模块路径
    const moduleBasePath = `${this.app.getBaseDir()}/modules/`;
    if (!fs.existsSync(moduleBasePath)) {
      return;
    }
    if (!this.allConfig['module']) {
      this.allConfig['module'] = {};
    }
    // 全局中间件
    const globalMiddlewareArr = [];
    for (const module of fs.readdirSync(moduleBasePath)) {
      const modulePath = `${moduleBasePath}/${module}`;
      const dirStats = fs.statSync(modulePath);
      if (dirStats.isDirectory()) {
        const configPath = `${modulePath}/config.${
          this.app.getEnv() == 'local' ? 'ts' : 'js'
        }`;
        if (fs.existsSync(configPath)) {
          const moduleConfig: ModuleConfig = require(configPath).default({
            app: this.app,
            env: this.app.getEnv(),
          });
          modules.push({
            order: moduleConfig.order || 0,
            module: module,
          });
          await this.moduleConfig(module, moduleConfig);
          // 处理全局中间件
          if (!_.isEmpty(moduleConfig.globalMiddlewares)) {
            globalMiddlewareArr.push({
              order: moduleConfig.order || 0,
              data: moduleConfig.globalMiddlewares,
            });
          }
        } else {
          throw new CoolCoreException(`模块【${module}】缺少config.ts配置文件`);
        }
      }
    }
    this.modules = _.orderBy(modules, ['order'], ['desc']).map(e => {
      return e.module;
    });
    await this.globalMiddlewareArr(globalMiddlewareArr);
  }

  /**
   * 模块配置
   * @param module 模块
   * @param config 配置
   */
  async moduleConfig(module, config) {
    // 追加配置
    this.allConfig['module'][module] = config;
  }

  /**
   * 全局中间件
   * @param middleware 中间件
   */
  async globalMiddlewareArr(middlewares: any[]) {
    middlewares = _.orderBy(middlewares, ['order'], ['desc']);
    for (const middleware of middlewares) {
      for (const item of middleware.data) {
        this.app.getMiddleware().insertLast(item);
      }
    }
  }
}
