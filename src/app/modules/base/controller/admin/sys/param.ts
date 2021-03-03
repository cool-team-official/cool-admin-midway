import { Get, Inject, Provide, Query } from '@midwayjs/decorator';
import { Context } from 'egg';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseSysParamEntity } from '../../../entity/sys/param';
import { BaseSysParamService } from '../../../service/sys/param';

/**
 * 参数配置
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: BaseSysParamEntity,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'keyName'],
  },
})
export class BaseSysParamController extends BaseController {
  @Inject()
  baseSysParamService: BaseSysParamService;

  @Inject()
  ctx: Context;

  /**
   * 根据配置参数key获得网页内容(富文本)
   */
  @Get('/html')
  async htmlByKey(@Query() key: string) {
    this.ctx.body = await this.baseSysParamService.htmlByKey(key);
  }
}
