import { Application } from 'egg';
import { ModuleConfig } from 'midwayjs-cool-core';

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
    middlewares: [],
  } as ModuleConfig;
};
