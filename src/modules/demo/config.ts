import { ModuleConfig } from '@cool-midway/core';
import { DemoMiddleware } from './middleware/demo';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: 'xxx',
    // 模块描述
    description: 'xxx',
    // 中间件，只对本模块有效
    middlewares: [DemoMiddleware],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // 其他配置
    a: 1,
  } as ModuleConfig;
};
