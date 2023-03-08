import { CloudFuncLogEntity } from './../../../entity/func/log';
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 日志
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CloudFuncLogEntity,
  pageQueryOp: {
    fieldEq: ['infoId'],
  },
})
export class AdminCloudFuncLogController extends BaseController {}
