import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 角色菜单
 */
@Entity('base_sys_role_menu')
export class BaseSysRoleMenuEntity extends BaseEntity {
  @Column({ comment: '角色ID' })
  roleId: number;

  @Column({ comment: '菜单ID' })
  menuId: number;
}
