import {
  ALL,
  Body,
  Get,
  Inject,
  Post,
  Provide,
  Query,
} from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { TaskInfoEntity } from '../../entity/info';
import { TaskInfoService } from '../../service/info';

/**
 * 任务
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: TaskInfoEntity,
  service: TaskInfoService,
  pageQueryOp: {
    fieldEq: ['status', 'type'],
  },
})
export class TaskInfoController extends BaseController {
  @Inject()
  taskInfoService: TaskInfoService;

  /**
   * 手动执行一次
   */
  @Post('/once')
  async once(@Body() id: number) {
    await this.taskInfoService.once(id);
    this.ok();
  }

  /**
   * 暂停任务
   */
  @Post('/stop')
  async stop(@Body() id: number) {
    await this.taskInfoService.stop(id);
    this.ok();
  }

  /**
   * 开始任务
   */
  @Post('/start')
  async start(@Body() id: number, @Body() type: number) {
    await this.taskInfoService.start(id, type);
    this.ok();
  }

  /**
   * 日志
   */
  @Get('/log')
  async log(@Query(ALL) params: any) {
    return this.ok(await this.taskInfoService.log(params));
  }
}
