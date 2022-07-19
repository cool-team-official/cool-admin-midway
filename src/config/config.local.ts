import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';

/**
 * 本地开发 npm run dev 读取的配置文件
 */
export default {
  orm: {
    type: 'mysql',
    host: '101.34.231.195',
    port: 3306,
    username: 'cool',
    password: 'G4NCHwcc4aJipPMy',
    database: 'cool',
    // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
    synchronize: true,
    // 打印日志
    logging: true,
    // 字符集
    charset: 'utf8mb4',
  },
  cool: {
    rpc: {
      name: 'main',
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 1,
      password: '',
    },
    // 是否自动导入数据库
    initDB: true,
  } as CoolConfig,
} as MidwayConfig;
