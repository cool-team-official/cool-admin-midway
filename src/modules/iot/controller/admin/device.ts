import { IotDeviceEntity } from './../../entity/device';
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 设备信息
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: IotDeviceEntity,
  pageQueryOp: {
    keyWordLikeFields: ['label', 'uniqueId'],
    fieldEq: ['status'],
  },
})
export class AdminIotDeviceController extends BaseController {}
