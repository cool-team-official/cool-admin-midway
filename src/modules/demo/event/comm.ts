import { Provide } from '@midwayjs/decorator';
import { CoolEvent, Event } from '@cool-midway/core';
import { Scope, ScopeEnum } from '@midwayjs/core';

/**
 * 普通事件
 */
@CoolEvent()
export class DemoCommEvent {
  /**
   * 根据事件名接收事件
   * @param msg
   * @param a
   */
  @Event('demo')
  async demo(msg, a) {
    console.log(`comm当前进程的ID是: ${process.pid}`);
    console.log('comm收到消息', msg, a);
  }
}
