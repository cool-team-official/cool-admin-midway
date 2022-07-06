import { DictTypeEntity } from './../../entity/type';
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 字典类型
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DictTypeEntity,
  listQueryOp: {
    keyWordLikeFields: ['name'],
  },
})
export class AdminDictTypeController extends BaseController {}
