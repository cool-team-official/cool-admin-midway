import { CoolConfig } from '@cool-midway/core';
import { MODETYPE } from '@cool-midway/file';
import { MidwayConfig } from '@midwayjs/core';
// import * as redisStore from 'cache-manager-ioredis';
import * as fsStore from 'cache-manager-fs-hash';

export default {
  // 修改成你自己独有的key
  keys: 'cool-admin for node',
  koa: {
    port: 8001,
  },
  // 文件上传
  upload: {
    fileSize: '200mb',
  },
  // 模板渲染
  view: {
    mapping: {
      '.html': 'ejs',
    },
  },
  // 本地缓存
  cache: {
    store: fsStore,
    options: {
      path: 'cache',
      ttl: -1,
    },
  },
  // redis缓存
  //   cache: {
  //     store: redisStore,
  //     options: {
  //       host: '127.0.0.1',
  //       port: 6379,
  //       password: '',
  //       db: 1,
  //     },
  //   },
  // cool配置
  cool: {
    // 是否自动导入数据库
    file: {
      // 上传模式 本地上传或云存储
      mode: MODETYPE.LOCAL,
      // 本地上传 文件地址前缀
      domain: 'http://127.0.0.1:8001',
    },
  } as CoolConfig,
} as
  | MidwayConfig
  | {
      cache: any;
    };
