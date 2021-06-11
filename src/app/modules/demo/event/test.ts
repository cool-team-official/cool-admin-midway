import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { CoolEvent, Event } from 'midwayjs-cool-core';

/**
 * 接收事件
 */
@Provide()
@Scope(ScopeEnum.Singleton)
@CoolEvent()
export class DemoEvent {
  /**
   * 根据事件名接收事件
   * @param msg
   * @param a
   */
  @Event('updateUser')
  async updateUser(msg, a) {
    console.log('ImEvent', 'updateUser', msg, a);
  }
}
