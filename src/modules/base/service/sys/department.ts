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
import { In, Repository } from 'typeorm';
import { BaseSysDepartmentEntity } from '../../entity/sys/department';
import * as _ from 'lodash';
import { BaseSysRoleDepartmentEntity } from '../../entity/sys/role_department';
import { BaseSysPermsService } from './perms';
import { BaseSysUserEntity } from '../../entity/sys/user';

/**
 * 描述
 */
@Provide()
export class BaseSysDepartmentService extends BaseService {
  @InjectEntityModel(BaseSysDepartmentEntity)
  baseSysDepartmentEntity: Repository<BaseSysDepartmentEntity>;

  @InjectEntityModel(BaseSysUserEntity)
  baseSysUserEntity: Repository<BaseSysUserEntity>;

  @InjectEntityModel(BaseSysRoleDepartmentEntity)
  baseSysRoleDepartmentEntity: Repository<BaseSysRoleDepartmentEntity>;

  @Inject()
  baseSysPermsService: BaseSysPermsService;

  @Inject()
  ctx;

  /**
   * 获得部门菜单
   */
  async list() {
    // 部门权限
    const permsDepartmentArr = await this.baseSysPermsService.departmentIds(
      this.ctx.admin.userId
    );

    // 过滤部门权限
    const find = this.baseSysDepartmentEntity.createQueryBuilder('a');
    if (this.ctx.admin.username !== 'admin') {
      find.andWhere('a.id in (:...ids)', {
        ids: !_.isEmpty(permsDepartmentArr) ? permsDepartmentArr : [null],
      });
      find.orWhere('a.userId = :userId', { userId: this.ctx.admin.userId });
    }
    find.addOrderBy('a.orderNum', 'ASC');
    const departments: BaseSysDepartmentEntity[] = await find.getMany();

    if (!_.isEmpty(departments)) {
      departments.forEach(e => {
        const parentMenu = departments.filter(m => {
          e.parentId = parseInt(e.parentId + '');
          if (e.parentId == m.id) {
            return m.name;
          }
        });
        if (!_.isEmpty(parentMenu)) {
          e.parentName = parentMenu[0].name;
        }
      });
    }
    return departments;
  }

  /**
   * 根据多个ID获得部门权限信息
   * @param {[]} roleIds 数组
   * @param isAdmin 是否超管
   */
  async getByRoleIds(roleIds: number[], isAdmin) {
    if (!_.isEmpty(roleIds)) {
      if (isAdmin) {
        const result = await this.baseSysDepartmentEntity.find();
        return result.map(e => {
          return e.id;
        });
      }
      const result = await this.baseSysRoleDepartmentEntity
        .createQueryBuilder('a')
        .where('a.roleId in (:...roleIds)', { roleIds })
        .getMany();
      if (!_.isEmpty(result)) {
        return _.uniq(
          result.map(e => {
            return e.departmentId;
          })
        );
      }
    }
    return [];
  }

  /**
   * 部门排序
   * @param params
   */
  async order(params) {
    for (const e of params) {
      await this.baseSysDepartmentEntity.update(e.id, e);
    }
  }

  /**
   * 删除
   */
  async delete(ids: number[]) {
    const { deleteUser } = this.ctx.request.body;
    await super.delete(ids);
    if (deleteUser) {
      await this.baseSysUserEntity.delete({ departmentId: In(ids) });
    } else {
      const topDepartment = await this.baseSysDepartmentEntity
        .createQueryBuilder('a')
        .where('a.parentId is null')
        .getOne();
      if (topDepartment) {
        await this.baseSysUserEntity.update(
          { departmentId: In(ids) },
          { departmentId: topDepartment.id }
        );
      }
    }
  }
}
