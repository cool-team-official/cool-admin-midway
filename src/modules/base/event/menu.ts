import { CoolEvent, Event } from '@cool-midway/core';
import { BaseSysMenuService } from '../service/sys/menu';
import { ILogger, Inject, Logger } from '@midwayjs/core';

/**
 * 导入菜单
 */
@CoolEvent()
export class BaseMenuEvent {
  @Inject()
  baseSysMenuService: BaseSysMenuService;

  @Logger()
  coreLogger: ILogger;

  @Event('onMenuImport')
  async onMenuImport(module, data) {
    await this.baseSysMenuService.import(data);
    this.coreLogger.info(
      '\x1B[36m [cool:module:base] midwayjs cool module base import [' +
        module +
        '] module menu success \x1B[0m'
    );
  }
}
