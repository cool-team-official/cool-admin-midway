import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
    const config = {} as DefaultConfig;

    config.orm = {
        type: 'mysql',
        host: '139.196.196.203',
        port: 3306,
        username: 'cool-admin-next',
        password: 'Rr4bktexbMNTPmyJ',
        database: 'cool-admin-next',
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: true,
        // 打印日志
        logging: true,
    }

    config.logger = {
        coreLogger: {
            consoleLevel: 'INFO'
        }
    }

    return config;
};
