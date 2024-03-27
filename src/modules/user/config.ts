import { ModuleConfig } from '@cool-midway/core';
import { UserMiddleware } from './middleware/app';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '用户模块',
    // 模块描述
    description: 'APP、小程序、公众号等用户',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [UserMiddleware],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // 短信
    sms: {
      // 验证码有效期，单位秒
      timeout: 60 * 3,
    },
    // jwt
    jwt: {
      // token 过期时间，单位秒
      expire: 60 * 60 * 24,
      // 刷新token 过期时间，单位秒
      refreshExpire: 60 * 60 * 24 * 30,
      // jwt 秘钥
      secret: 'cool-app-xxxxxx',
    },
  } as ModuleConfig;
};
