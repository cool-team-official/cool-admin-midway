import { Inject, Post, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolEventManager,
} from '@cool-midway/core';

/**
 * 事件
 */
@Provide()
@CoolController()
export class AppDemoEventController extends BaseController {
  @Inject()
  coolEventManager: CoolEventManager;

  @Post('/send')
  async send() {
    await this.coolEventManager.emit('demo', { a: 1 }, 1);
    return this.ok();
  }
}
