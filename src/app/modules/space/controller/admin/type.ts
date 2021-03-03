import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseAppSpaceTypeEntity } from '../../../base/entity/app/space/type';

/**
 * 空间分类
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BaseAppSpaceTypeEntity,
})
export class BaseAppSpaceTypeController extends BaseController {}
