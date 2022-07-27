import { TaskInfoService } from './../service/info';
import { CoolEvent, Event } from '@cool-midway/core';
import { Inject } from '@midwayjs/decorator';

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
