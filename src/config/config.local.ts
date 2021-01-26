import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
    const config = {} as DefaultConfig;

    config.orm = {
        type: 'mysql',
        host: '139.196.196.203',
        port: 3306,
        username: 'midway',
        password: 'Yxd8mJYE4p8BytHF',
        database: 'midway',
        synchronize: true,
        logging: false,
    }

    return config;
};
