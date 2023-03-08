import { IotMessageEntity } from './../../entity/message';
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 设备消息
 */
@Provide()
@CoolController({
  api: ['page'],
  entity: IotMessageEntity,
  pageQueryOp: {
    fieldEq: ['deviceId'],
  },
})
export class AdminIotMessageController extends BaseController {}
