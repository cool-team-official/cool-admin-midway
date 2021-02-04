import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  // cookie sign key
  config.keys = appInfo.name + 'cool-admin-next';

  // 中间件
  //config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 替换成midway的日志
  config.midwayFeature = {
    replaceEggLogger: true
  }

  return config;
};
