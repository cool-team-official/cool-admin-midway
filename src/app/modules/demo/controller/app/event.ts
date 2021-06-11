import { Get, Inject, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolEventManager,
} from 'midwayjs-cool-core';

/**
 * 事件
 */
@Provide()
@CoolController()
export class DemoEventController extends BaseController {
  @Inject('cool:coolEventManager')
  coolEventManager: CoolEventManager;

  /**
   * 发送事件
   */
  @Get('/send')
  public async send() {
    this.coolEventManager.emit('updateUser', { a: 1 }, 12);
  }
}
