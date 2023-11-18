import {
  App,
  ILogger,
  IMidwayApplication,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import * as path from 'path';
import * as fs from 'fs';

/**
 * swagger
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class BaseSwaggerIndex {
  @Logger()
  coreLogger: ILogger;

  @App()
  app: IMidwayApplication;

  basePath = '';
  lockPath = '';

  /**
   * 初始化
   */
  async init() {
    this.basePath = this.app.getBaseDir();
    this.lockPath = path.join(this.basePath, '..', 'lock');
    //this.copyToPublic();
  }

  /**
   * 将swagger静态资源包复制到public目录下
   */
  async copyToPublic() {
    const lockFile = path.join(this.lockPath, 'static.swagger.lock');
    if (fs.existsSync(lockFile)) return;
    // swagger静态资源包
    const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
    console.log('swaggerUiAssetPath', swaggerUiAssetPath);
    // 复制整个目录到public的swagger目录下 没有则创建
    const publicPath = path.join(this.basePath, '..', 'public');
    const swaggerPath = path.join(publicPath, 'swagger');
    if (!fs.existsSync(swaggerPath)) {
      fs.mkdirSync(swaggerPath);
    }
    this.copyDirectory(swaggerUiAssetPath, swaggerPath);
    fs.writeFileSync(lockFile, 'static');
    this.coreLogger.info(
      '\x1B[36m [cool:module:base] midwayjs cool module base swagger static copy to public\x1B[0m'
    );
  }

  /**
   * 复制目录
   * @param src
   * @param dest
   */
  copyDirectory(src, dest) {
    // 确保目标文件夹存在
    fs.mkdirSync(dest, { recursive: true });

    // 读取源文件夹中的所有文件和子文件夹
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      // 递归复制子文件夹
      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        // 同步复制文件
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}
