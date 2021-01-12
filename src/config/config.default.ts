import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1610416114197_5726';

  // add your config here
  config.middleware = [];

  config.view = {
    root: path.join(appInfo.baseDir, 'view'),
  }

  return config;
};
