import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { SpaceTypeEntity } from '../../entity/type';

/**
 * 空间分类
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: SpaceTypeEntity,
})
export class BaseAppSpaceTypeController extends BaseController {}
