import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { BaseAppSpaceTypeEntity } from '../../entity/type';

/**
 * 空间分类
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BaseAppSpaceTypeEntity,
})
export class BaseAppSpaceTypeController extends BaseController {}
