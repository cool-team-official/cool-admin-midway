import { Provide, Post, Inject, Body, Get } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseSysLogEntity } from '../../../entity/sys/log';
import { BaseSysUserEntity } from '../../../entity/sys/user';
import { BaseSysConfService } from '../../../service/sys/conf';
import { BaseSysLogService } from '../../../service/sys/log';

/**
 * 系统日志
 */
@Provide()
@CoolController({
  api: ['page'],
  entity: BaseSysLogEntity,
  pageQueryOp: {
    keyWordLikeFields: ['b.name', 'a.params', 'a.ipAddr'],
    select: ['a.*, b.name'],
    leftJoin: [
      {
        entity: BaseSysUserEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
      },
    ],
  },
})
export class BaseSysLogController extends BaseController {
  @Inject()
  baseSysLogService: BaseSysLogService;

  @Inject()
  baseSysConfService: BaseSysConfService;

  /**
   * 清空日志
   */
  @Post('/clear')
  public async clear() {
    await this.baseSysLogService.clear(true);
    return this.ok();
  }

  /**
   * 设置日志保存时间
   */
  @Post('/setKeep')
  public async setKeep(@Body() value: number) {
    await this.baseSysConfService.updateVaule('logKeep', value);
    return this.ok();
  }

  /**
   * 获得日志保存时间
   */
  @Get('/getKeep')
  public async getKeep() {
    return this.ok(await this.baseSysConfService.getValue('logKeep'));
  }
}
