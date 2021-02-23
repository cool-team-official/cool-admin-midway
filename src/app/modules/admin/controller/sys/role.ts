import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { AdminSysRoleEntity } from '../../entity/sys/role';

/**
 * 系统角色
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AdminSysRoleEntity,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'label'],
    where: (async () => {
      return [
        ['label != :label', { label: 'admin' }],
      ]
    })
  }
})
export class AdminSysRoleController extends BaseController {

}