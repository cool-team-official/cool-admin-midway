import { Inject, Post } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolEventManager,
} from '@cool-midway/core';

/**
 * 事件
 */
@CoolController()
export class OpenDemoEventController extends BaseController {
  @Inject()
  coolEventManager: CoolEventManager;

  @Post('/comm', { summary: '普通事件，本进程生效' })
  async comm() {
    await this.coolEventManager.emit('demo', { a: 2 }, 1);
    return this.ok();
  }

  @Post('/global', { summary: '全局事件，多进程都有效' })
  async global() {
    await this.coolEventManager.globalEmit('demo', false, { a: 2 }, 1);
    return this.ok();
  }
}
