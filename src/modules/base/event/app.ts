import { CoolEvent, Event } from '@cool-midway/core';
import { App, Config, ILogger, Logger } from '@midwayjs/core';
import { IMidwayKoaApplication } from '@midwayjs/koa';
import * as fs from 'fs';
import * as path from 'path';
import { v1 as uuid } from 'uuid';

/**
 * 修改jwt.secret
 */
@CoolEvent()
export class BaseAppEvent {
  @Logger()
  coreLogger: ILogger;

  @Config('module')
  config;

  @App()
  app: IMidwayKoaApplication;

  @Event('onServerReady')
  async onServerReady() {
    this.checkConfig();
  }

  /**
   * 检查配置
   */
  async checkConfig() {
    if (this.config.base.jwt.secret == 'cool-admin-xxxxxx') {
      this.coreLogger.warn(
        '检测到模块[base] jwt.secret 配置是默认值，即将自动修改...'
      );
      setTimeout(() => {
        const filePath = path.join(
          this.app.getBaseDir(),
          '..',
          'src',
          'modules',
          'base',
          'config.ts'
        );
        // 替换文件内容
        let fileData = fs.readFileSync(filePath, 'utf8');
        const secret = uuid().replace(/-/g, '');
        this.config.base.jwt.secret = secret;
        fs.writeFileSync(
          filePath,
          fileData.replace('cool-admin-xxxxxx', secret)
        );
        this.coreLogger.info(
          '\x1B[36m [cool:module:base] midwayjs cool module base auto modify jwt.secret\x1B[0m'
        );
      }, 6000);
    }
  }
}
