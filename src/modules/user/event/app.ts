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
export class UserAppEvent {
  @Logger()
  coreLogger: ILogger;

  @Config('module')
  config;

  @App()
  app: IMidwayKoaApplication;

  @Event('onServerReady')
  async onServerReady() {
    if (this.config.user.jwt.secret == 'cool-app-xxxxxx') {
      const filePath = path.join(
        this.app.getBaseDir(),
        'modules',
        'user',
        'config.ts'
      );
      // 替换文件内容
      let fileData = fs.readFileSync(filePath, 'utf8');
      const secret = uuid().replace(/-/g, '');
      this.config.user.jwt.secret = secret;
      fs.writeFileSync(filePath, fileData.replace('cool-app-xxxxxx', secret));
      this.coreLogger.info(
        '\x1B[36m [cool:module:user] midwayjs cool module user auto modify jwt.secret\x1B[0m'
      );
    }
  }
}
