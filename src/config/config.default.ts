import { CoolConfig } from '@cool-midway/core';
import { MODETYPE } from '@cool-midway/file';
import { MidwayConfig } from '@midwayjs/core';

export default {
  // 修改成你自己独有的key
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
  // cool配置
  cool: {
    // 是否自动导入数据库
    file: {
      // 上传模式 本地上传或云存储
      mode: MODETYPE.CLOUD,
      // 本地上传 文件地址前缀
      domain: 'http://127.0.0.1:8001',
    },
  } as CoolConfig,
} as
  | MidwayConfig
  | {
      cache: any;
    };
