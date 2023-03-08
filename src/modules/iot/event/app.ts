import { Inject } from '@midwayjs/core';
import { CoolEvent, Event } from '@cool-midway/core';
import { IotDeviceService } from '../service/device';

/**
 * 应用事件
 */
@CoolEvent()
export class AppEvent {
  @Inject()
  iotDeviceService: IotDeviceService;

  @Event('onServerReady')
  async onServerReady() {
    // 重置设备状态
    await this.iotDeviceService.resetStatus();
  }
}
