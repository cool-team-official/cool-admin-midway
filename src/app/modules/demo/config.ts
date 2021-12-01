import { Application } from 'egg';
import { ModuleConfig } from '@cool-midway/core';

/**
 * 示例
 */
export default (app: Application) => {
  return {
    // 模块名称
    name: '测试模块',
    // 模块描述
    description: '演示示例',
    // 中间件
    middlewares: ['testMiddleware'],
    // 全局中间件
    globalMiddlewares: ['demoUserMiddleware'],
  } as ModuleConfig;
};
