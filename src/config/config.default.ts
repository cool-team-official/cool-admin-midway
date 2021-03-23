import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { CoolConfig } from 'midwayjs-cool-core';
import * as path from 'path';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  // cookie sign key
  config.keys = appInfo.name + 'cool-admin-next';

  // 启用中间件 这里需要设置为 [] 否则CoolController设置的中间件也会无效
  config.middleware = [];

  // 模板渲染 用法 https://nunjucks.bootcss.com
  config.view = {
    root: [path.join(appInfo.baseDir, 'app/view')].join(','),
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  // 靜態目錄及緩存設置
  config.static = {
    prefix: '',
    dir: path.join(appInfo.baseDir, '..', 'public'),
    dynamic: true,
    preload: false,
    // maxAge: 31536000,
    maxAge: 0,
    buffer: false,
  };

  // 修改默认的 favicon.ico serverless 环境下无用
  // config.siteFile = {
  //   '/favicon.ico': fs.readFileSync(
  //     path.join(appInfo.baseDir, 'app/public/favicon.ico')
  //   ),
  // };

  // 关闭安全校验
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // cool-admin特有的配置
  config.cool = {
    // 是否初始化模块数据库
    initDB: true,
    // 全局路由前缀
    router: {
      prefix: '',
    },
    // 单点登录
    sso: false,
    // jwt 生成解密token的
    jwt: {
      // 注意： 最好重新修改，防止破解
      secret: 'FOAPOFALOEQIPNNLQ',
      // token
      token: {
        // 2小时过期，需要用刷新token
        expire: 2 * 3600,
        // 15天内，如果没操作过就需要重新登录
        refreshExpire: 24 * 3600 * 15,
      },
    },
    // 分页配置
    page: {
      // 分页查询每页条数
      size: 15,
    },
    // 文件上传
    file: {
      // 文件路径前缀 本地上传模式下 有效
      domain: 'https://admin.cool-js.cool',
    },
  } as CoolConfig;

  // 文件上传
  config.multipart = {
    fileSize: '100mb',
    mode: 'file',
    whitelist: [
      // images
      '.jpg',
      '.jpeg', // image/jpeg
      '.png', // image/png, image/x-png
      '.gif', // image/gif
      '.bmp', // image/bmp
      '.wbmp', // image/vnd.wap.wbmp
      '.webp',
      '.tif',
      '.psd',
      // text
      '.svg',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.less',
      '.html',
      '.htm',
      '.xml',
      // tar
      '.zip',
      '.gz',
      '.tgz',
      '.gzip',
      // video
      '.mp3',
      '.mp4',
      '.avi',
      // 证书
      '.p12',
      '.pem',
    ],
  };

  // 将egg日志替换成midway
  config.midwayFeature = {
    replaceEggLogger: true,
  };

  return config;
};
