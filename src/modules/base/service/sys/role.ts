/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
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
    const userRole = await this.baseSysUserRoleEntity.findBy({ userId });
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
    await Promise.all(
      menuIdList.map(async e => {
        return await this.baseSysRoleMenuEntity.save({ roleId, menuId: e });
      })
    );
    // 更新部门权限
    await this.baseSysRoleDepartmentEntity.delete({ roleId });
    await Promise.all(
      departmentIds.map(async e => {
        return await this.baseSysRoleDepartmentEntity.save({
          roleId,
          departmentId: e,
        });
      })
    );
    // 刷新权限
    const userRoles = await this.baseSysUserRoleEntity.findBy({ roleId });
    for (const userRole of userRoles) {
      await this.baseSysPermsService.refreshPerms(userRole.userId);
    }
  }

  /**
   * 角色信息
   * @param id
   */
  async info(id) {
    const info = await this.baseSysRoleEntity.findOneBy({ id });
    if (info) {
      const menus = await this.baseSysRoleMenuEntity.findBy(
        id !== 1 ? { roleId: id } : {}
      );
      const menuIdList = menus.map(e => {
        return parseInt(e.menuId + '');
      });
      const departments = await this.baseSysRoleDepartmentEntity.findBy(
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
      .createQueryBuilder('a')
      .where(
        new Brackets(qb => {
          qb.where('a.id !=:id', { id: 1 }); // 超级管理员的角色不展示
          // 如果不是超管，只能看到自己新建的或者自己有的角色
          if (this.ctx.admin.username !== 'admin') {
            qb.andWhere('(a.userId=:userId or a.id in (:...roleId))', {
              userId: this.ctx.admin.userId,
              roleId: this.ctx.admin.roleIds,
            });
          }
        })
      )
      .getMany();
  }
}
