import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysRoleEntity } from '../../entity/sys/role';
import { BaseSysUserRoleEntity } from '../../entity/sys/user_role';
import * as _ from 'lodash';
import { BaseSysRoleMenuEntity } from '../../entity/sys/role_menu';
import { BaseSysRoleDepartmentEntity } from '../../entity/sys/role_department';
import { BaseSysPermsService } from './perms';
import { Brackets } from 'typeorm';

/**
 * 角色
 */
@Provide()
export class BaseSysRoleService extends BaseService {
  @InjectEntityModel(BaseSysRoleEntity)
  baseSysRoleEntity: Repository<BaseSysRoleEntity>;

  @InjectEntityModel(BaseSysUserRoleEntity)
  baseSysUserRoleEntity: Repository<BaseSysUserRoleEntity>;

  @InjectEntityModel(BaseSysRoleMenuEntity)
  baseSysRoleMenuEntity: Repository<BaseSysRoleMenuEntity>;

  @InjectEntityModel(BaseSysRoleDepartmentEntity)
  baseSysRoleDepartmentEntity: Repository<BaseSysRoleDepartmentEntity>;

  @Inject()
  baseSysPermsService: BaseSysPermsService;

  @Inject()
  ctx;

  /**
   * 根据用户ID获得所有用户角色
   * @param userId
   */
  async getByUser(userId: number): Promise<number[]> {
    const userRole = await this.baseSysUserRoleEntity.find({ userId });
    if (!_.isEmpty(userRole)) {
      return userRole.map(e => {
        return e.roleId;
      });
    }
    return [];
  }

  /**
   *
   * @param param
   */
  async modifyAfter(param) {
    if (param.id) {
      this.updatePerms(param.id, param.menuIdList, param.departmentIdList);
    }
  }

  /**
   * 更新权限
   * @param roleId
   * @param menuIdList
   * @param departmentIds
   */
  async updatePerms(roleId, menuIdList?, departmentIds = []) {
    // 更新菜单权限
    await this.baseSysRoleMenuEntity.delete({ roleId });
    for (const e of menuIdList) {
      await this.baseSysRoleMenuEntity.save({ roleId, menuId: e });
    }
    // 更新部门权限
    await this.baseSysRoleDepartmentEntity.delete({ roleId });
    for (const departmentId of departmentIds) {
      await this.baseSysRoleDepartmentEntity.save({ roleId, departmentId });
    }
    // 刷新权限
    const userRoles = await this.baseSysUserRoleEntity.find({ roleId });
    for (const userRole of userRoles) {
      await this.baseSysPermsService.refreshPerms(userRole.userId);
    }
  }

  /**
   * 角色信息
   * @param id
   */
  async info(id) {
    const info = await this.baseSysRoleEntity.findOne({ id });
    if (info) {
      const menus = await this.baseSysRoleMenuEntity.find(
        id !== 1 ? { roleId: id } : {}
      );
      const menuIdList = menus.map(e => {
        return parseInt(e.menuId + '');
      });
      const departments = await this.baseSysRoleDepartmentEntity.find(
        id !== 1 ? { roleId: id } : {}
      );
      const departmentIdList = departments.map(e => {
        return parseInt(e.departmentId + '');
      });
      return {
        ...info,
        menuIdList,
        departmentIdList,
      };
    }
    return {};
  }

  async list() {
    return this.baseSysRoleEntity
      .createQueryBuilder()
      .where(
        new Brackets(qb => {
          qb.where('id !=:id', { id: 1 }); // 超级管理员的角色不展示
          // 如果不是超管，只能看到自己新建的或者自己有的角色
          if (this.ctx.admin.username !== 'admin') {
            qb.andWhere('(userId=:userId or id in (:roleId))', {
              userId: this.ctx.admin.userId,
              roleId: this.ctx.admin.roleIds,
            });
          }
        })
      )
      .getMany();
  }
}
