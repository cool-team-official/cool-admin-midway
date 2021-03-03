import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysMenuEntity } from '../../entity/sys/menu';
import * as _ from 'lodash';
import { Context } from 'egg';
import { BaseSysPermsService } from './perms';

/**
 * 菜单
 */
@Provide()
export class BaseSysMenuService extends BaseService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(BaseSysMenuEntity)
  baseSysMenuEntity: Repository<BaseSysMenuEntity>;

  @Inject()
  baseSysPermsService: BaseSysPermsService;

  /**
   * 获得所有菜单
   */
  async list() {
    const menus = await this.getMenus(
      this.ctx.admin.roleIds,
      this.ctx.admin.username === 'admin'
    );
    if (!_.isEmpty(menus)) {
      menus.forEach(e => {
        const parentMenu = menus.filter(m => {
          e.parentId = parseInt(e.parentId);
          if (e.parentId == m.id) {
            return m.name;
          }
        });
        if (!_.isEmpty(parentMenu)) {
          e.parentName = parentMenu[0].name;
        }
      });
    }
    return menus;
  }

  /**
   * 修改之后
   * @param param
   */
  async modifyAfter(param) {
    if (param.id) {
      await this.refreshPerms(param.id);
    }
  }

  /**
   * 根据角色获得权限信息
   * @param {[]} roleIds 数组
   */
  async getPerms(roleIds) {
    let perms = [];
    if (!_.isEmpty(roleIds)) {
      const result = await this.nativeQuery(
        `SELECT a.perms FROM base_sys_menu a ${this.setSql(
          !roleIds.includes('1'),
          'JOIN base_sys_role_menu b on a.id = b.menuId AND b.roleId in (?)',
          [roleIds]
        )}
            where 1=1 and a.perms is not NULL
            `,
        [roleIds]
      );
      if (result) {
        result.forEach(d => {
          if (d.perms) {
            perms = perms.concat(d.perms.split(','));
          }
        });
      }
      perms = _.uniq(perms);
      perms = _.remove(perms, n => {
        return !_.isEmpty(n);
      });
    }
    return _.uniq(perms);
  }

  /**
   * 获得用户菜单信息
   * @param roleIds
   * @param isAdmin 是否是超管
   */
  async getMenus(roleIds, isAdmin) {
    return await this.nativeQuery(`
        SELECT
            a.*
        FROM
            base_sys_menu a
        ${this.setSql(
          !isAdmin,
          'JOIN base_sys_role_menu b on a.id = b.menuId AND b.roleId in (?)',
          [roleIds]
        )}
        GROUP BY a.id
        ORDER BY
            orderNum ASC`);
  }

  /**
   * 删除
   * @param ids
   */
  async delete(ids) {
    let idArr;
    if (ids instanceof Array) {
      idArr = ids;
    } else {
      idArr = ids.split(',');
    }
    for (const id of idArr) {
      await this.baseSysMenuEntity.delete({ id });
      await this.delChildMenu(id);
    }
  }

  /**
   * 删除子菜单
   * @param id
   */
  private async delChildMenu(id) {
    await this.refreshPerms(id);
    const delMenu = await this.baseSysMenuEntity.find({ parentId: id });
    if (_.isEmpty(delMenu)) {
      return;
    }
    const delMenuIds = delMenu.map(e => {
      return e.id;
    });
    await this.baseSysMenuEntity.delete(delMenuIds);
    for (const menuId of delMenuIds) {
      await this.delChildMenu(menuId);
    }
  }

  /**
   * 更新权限
   * @param menuId
   */
  async refreshPerms(menuId) {
    const users = await this.nativeQuery(
      'select b.userId from base_sys_role_menu a left join base_sys_user_role b on a.roleId = b.roleId where a.menuId = ? group by b.userId',
      [menuId]
    );
    // 刷新admin权限
    await this.baseSysPermsService.refreshPerms(1);
    if (!_.isEmpty(users)) {
      // 刷新其他权限
      for (const user of users) {
        await this.baseSysPermsService.refreshPerms(user.userId);
      }
    }
  }
}
