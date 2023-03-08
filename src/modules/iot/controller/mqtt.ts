import { Get, Inject, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { CoolMqttServe } from '@cool-midway/iot';

/**
 * MQTT
 */
@Provide()
@CoolController()
export class IotMqttController extends BaseController {
  @Inject()
  coolMqttServe: CoolMqttServe;

  @Get('/publish')
  async publish() {
    await this.coolMqttServe.publish('presence', 'hello');
    return this.ok();
  }
}
