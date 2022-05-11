import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { BaseSysMenuService } from './menu';
import { BaseSysRoleService } from './role';
import { BaseSysDepartmentService } from './department';
import { Context } from '@midwayjs/koa';
import { CacheManager } from '@midwayjs/cache';

/**
 * 权限
 */
@Provide()
export class BaseSysPermsService extends BaseService {
  @Inject()
  cacheManager: CacheManager;

  @Inject()
  baseSysMenuService: BaseSysMenuService;

  @Inject()
  baseSysRoleService: BaseSysRoleService;

  @Inject()
  baseSysDepartmentService: BaseSysDepartmentService;

  @Inject()
  ctx: Context;

  /**
   * 刷新权限
   * @param userId 用户ID
   */
  async refreshPerms(userId) {
    const roleIds = await this.baseSysRoleService.getByUser(userId);
    const perms = await this.baseSysMenuService.getPerms(roleIds);
    await this.cacheManager.set(`admin:perms:${userId}`, perms);
    // 更新部门权限
    const departments = await this.baseSysDepartmentService.getByRoleIds(
      roleIds,
      this.ctx.admin.username === 'admin'
    );
    await this.cacheManager.set(`admin:department:${userId}`, departments);
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
    const department: any = await this.cacheManager.get(
      `admin:department:${userId}`
    );
    if (department) {
      return department;
    } else {
      return [];
    }
  }
}
