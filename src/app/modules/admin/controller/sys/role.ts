import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { Context } from 'vm';
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
    where: (async (ctx: Context) => {
      const { userId, roleIds, role } = ctx.admin;
      return [
        // 超级管理员的角色不展示
        ['label != :label', { label: 'admin' }],
        // 如果不是超管，只能看到自己新建的或者自己有的角色
        ['(userId=:userId or id in (:roleIds))', { userId, roleIds }, role != 'admin']
      ]
    })
  }
})
export class AdminSysRoleController extends BaseController {

}