import { CoolEvent, Event } from '@cool-midway/core';

/**
 * 接收事件
 */
@CoolEvent()
export class DemoEvent {
  /**
   * 根据事件名接收事件
   * @param msg
   * @param a
   */
  @Event('demo')
  async updatdemoeUser(msg, a) {
    console.log('收到消息', msg, a);
  }
}
