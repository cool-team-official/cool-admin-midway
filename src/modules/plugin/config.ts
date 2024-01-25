import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default options => {
  return {
    // 模块名称
    name: '插件模块',
    // 模块描述
    description: '插件查看、安装、卸载、配置等',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // 基础插件配置
    hooks: {
      // 文件上传
      upload: {
        // 地址前缀
        domain: `http://127.0.0.1:${options?.app?.getConfig('koa.port')}`,
      },
    },
  } as ModuleConfig;
};
