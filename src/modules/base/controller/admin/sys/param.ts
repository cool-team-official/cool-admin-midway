import { Get, Inject, Provide, Query } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { BaseSysParamEntity } from '../../../entity/sys/param';
import { BaseSysParamService } from '../../../service/sys/param';
import { Context } from '@midwayjs/koa';

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
  @Get('/html', { summary: '获得网页内容的参数值' })
  async htmlByKey(@Query('key') key: string) {
    this.ctx.body = await this.baseSysParamService.htmlByKey(key);
  }
}
