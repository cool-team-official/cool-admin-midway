import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default ({ app }) => {
  return {
    // 模块名称
    name: 'Swagger',
    // 模块描述
    description: '处理和生成swagger文档',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // swagger基本配置
    base: {
      openapi: '3.1.0',
      info: {
        title: 'Cool Admin 在线API文档',
        version: '7.x',
        description: '本文档是由Cool Admin内部自动构建完成',
        contact: {
          name: '开发文档',
          url: 'https://cool-js.com',
        },
      },
      // 请求地址
      servers: [
        {
          url: `http://127.0.0.1:${app?.getConfig('koa.port') || 8001}`,
          description: '本地后台地址',
        },
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          Auth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
    },
  } as ModuleConfig;
};
