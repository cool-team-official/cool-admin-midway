import { Application } from 'egg';
import { ModuleConfig } from 'midwayjs-cool-core';

/**
 * 模块配置
 */
export default (app: Application) => {
  return {
    // 模块名称
    name: '任务调度',
    // 模块描述
    description: '任务调度模块，支持分布式任务，由redis整个集群的任务',
    // 中间件
    middlewares: [],
  } as ModuleConfig;
};
