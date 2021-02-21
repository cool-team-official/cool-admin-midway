import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  // cookie sign key
  config.keys = appInfo.name + 'cool-admin-next';

  // 中间件
  config.middleware = ['reportMiddleware'];

  // 关闭安全校验
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // cool-admin特有的配置
  config.cool = {
    // 全局路由前缀
    router: {
      prefix: ''
    },
    // 分页配置
    page: {
      // 分页查询每页条数
      size: 15,
    }
  }

  // 将egg日志替换成midway
  config.midwayFeature = {
    replaceEggLogger: true
  }

  return config;
};
