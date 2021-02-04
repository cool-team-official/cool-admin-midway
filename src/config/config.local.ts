import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
    const config = {} as DefaultConfig;

    config.orm = {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123123',
        database: 'cool-admin-next',
        synchronize: true,
        logging: false,
    }

    config.logger = {
        coreLogger: {
            consoleLevel: 'INFO'
        }
    }

    return config;
};
