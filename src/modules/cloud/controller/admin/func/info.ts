import { CloudFuncService } from './../../../service/func';
import { CloudFuncInfoEntity } from '../../../entity/func/info';
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { CloudReq } from '@cool-midway/cloud';

/**
 * 云函数
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CloudFuncInfoEntity,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['status'],
  },
})
export class AdminCloudFuncInfoController extends BaseController {
  @Inject()
  cloudFuncService: CloudFuncService;

  @Post('/invoke', { summary: '调用云函数' })
  async invoke(
    @Body() req: CloudReq,
    @Body('id') id: number,
    @Body('content') content: string
  ) {
    return this.ok(await this.cloudFuncService.invoke(req, id, content));
  }
}
