import { CoolConfig, MODETYPE } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import * as fsStore from '@cool-midway/cache-manager-fs-hash';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: 'cool-admin for node',
  koa: {
    port: 8001,
  },
  // 模板渲染
  view: {
    mapping: {
      '.html': 'ejs',
    },
  },
  // 文件上传
  upload: {
    fileSize: '200mb',
    whitelist: null,
  },
  // 缓存 可切换成其他缓存如：redis http://midwayjs.org/docs/extensions/cache
  cache: {
    store: fsStore,
    options: {
      path: 'cache',
      ttl: -1,
    },
  },
  cool: {
    file: {
      // 上传模式 本地上传或云存储
      mode: MODETYPE.LOCAL,
      // 本地上传 文件地址前缀
      domain: 'http://127.0.0.1:8001',
    },
  } as CoolConfig,
} as MidwayConfig;
