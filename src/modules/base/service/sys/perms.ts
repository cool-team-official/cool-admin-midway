import { Inject, InjectClient, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { BaseSysMenuService } from './menu';
import { BaseSysRoleService } from './role';
import { BaseSysDepartmentService } from './department';
import { Context } from '@midwayjs/koa';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { BaseSysRoleEntity } from '../../entity/sys/role';
import { In, Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';

/**
 * 权限
 */
@Provide()
export class BaseSysPermsService extends BaseService {
  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Inject()
  baseSysMenuService: BaseSysMenuService;

  @Inject()
  baseSysRoleService: BaseSysRoleService;

  @Inject()
  baseSysDepartmentService: BaseSysDepartmentService;

  @InjectEntityModel(BaseSysRoleEntity)
  baseSysRoleEntity: Repository<BaseSysRoleEntity>;

  @Inject()
  ctx: Context;
  base: any;

  /**
   * 刷新权限
   * @param userId 用户ID
   */
  async refreshPerms(userId) {
    await this.midwayCache.del(`admin:token:${userId}`);
    const roleIds = await this.baseSysRoleService.getByUser(userId);
    const perms = await this.baseSysMenuService.getPerms(roleIds);
    await this.midwayCache.set(`admin:perms:${userId}`, perms);
    // 更新部门权限
    const departments = await this.baseSysDepartmentService.getByRoleIds(
      roleIds,
      await this.isAdmin(roleIds)
    );
    await this.midwayCache.set(`admin:department:${userId}`, departments);
  }

  /**
   * 根据角色判断是不是超管
   * @param roleIds
   */
  async isAdmin(roleIds: number[]) {
    const roles = await this.baseSysRoleEntity.findBy({ id: In(roleIds) });
    const roleLabels = roles.map(item => item.label);
    return roleLabels.includes('admin');
  }

  /**
   * 获得权限菜单
   * @param roleIds
   */
  async permmenu(roleIds: number[]) {
    const perms = await this.baseSysMenuService.getPerms(roleIds);
    const menus = await this.baseSysMenuService.getMenus(
      roleIds,
      this.ctx.admin.username === 'admin'
    );
    return { perms, menus };
  }

  /**
   * 根据用户ID获得部门权限
   * @param userId
   * @return 部门ID数组
   */
  async departmentIds(userId: number) {
    const department: any = await this.midwayCache.get(
      `admin:department:${userId}`
    );
    if (department) {
      return department;
    } else {
      return [];
    }
  }
}
