import { DictTypeEntity } from './../../entity/type';
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { DictTypeService } from '../../service/type';

/**
 * 字典类型
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DictTypeEntity,
  service: DictTypeService,
  listQueryOp: {
    keyWordLikeFields: ['name'],
  },
})
export class AdminDictTypeController extends BaseController {}
