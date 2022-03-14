import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysDepartmentEntity } from '../../entity/sys/department';
import * as _ from 'lodash';
import { BaseSysRoleDepartmentEntity } from '../../entity/sys/role_department';
import { BaseSysPermsService } from './perms';

/**
 * 描述
 */
@Provide()
export class BaseSysDepartmentService extends BaseService {
  @InjectEntityModel(BaseSysDepartmentEntity)
  baseSysDepartmentEntity: Repository<BaseSysDepartmentEntity>;

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
    const find = this.baseSysDepartmentEntity.createQueryBuilder();
    if (this.ctx.admin.username !== 'admin')
      find.andWhere('id in (:ids)', {
        ids: !_.isEmpty(permsDepartmentArr) ? permsDepartmentArr : [null],
      });
    find.addOrderBy('orderNum', 'ASC');
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
        .createQueryBuilder()
        .where('roleId in (:roleIds)', { roleIds })
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
    await this.baseSysDepartmentEntity.delete(ids);
    if (deleteUser) {
      await this.nativeQuery(
        'delete from base_sys_user where departmentId in (?)',
        [ids]
      );
    } else {
      const topDepartment = await this.baseSysDepartmentEntity
        .createQueryBuilder()
        .where('parentId is null')
        .getOne();
      if (topDepartment) {
        await this.nativeQuery(
          'update base_sys_user a set a.departmentId = ? where a.departmentId in (?)',
          [topDepartment.id, ids]
        );
      }
    }
  }
}
