import { IotMqttService } from './../../service/mqtt';
import { Provide, Get, Post, Body, Inject } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * MQTT相关
 */
@Provide()
@CoolController()
export class AdminIotMqttController extends BaseController {
  @Inject()
  iotMqttService: IotMqttService;

  @Get('/config', { summary: 'MQTT配置信息' })
  async config() {
    return this.ok(await this.iotMqttService.config());
  }

  @Post('/publish', { summary: '推送消息' })
  async publish(
    @Body('uniqueId') uniqueId: string,
    @Body('data') data: string
  ) {
    await this.iotMqttService.publish(uniqueId, data);
    return this.ok();
  }
}
