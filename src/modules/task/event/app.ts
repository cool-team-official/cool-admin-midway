import { Inject } from '@midwayjs/core';
import { TaskInfoService } from './../service/info';
import { CoolEvent, Event } from '@cool-midway/core';

/**
 * 应用事件
 */
@CoolEvent()
export class AppEvent {
  @Inject()
  taskInfoService: TaskInfoService;

  @Event('onServerReady')
  async onServerReady() {
    this.taskInfoService.initTask();
  }
}
