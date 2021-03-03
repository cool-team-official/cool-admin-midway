import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

/**
 * 角色菜单
 */
@EntityModel('base_sys_role_menu')
export class BaseSysRoleMenuEntity extends BaseEntity {
  @Column({ comment: '角色ID', type: 'bigint' })
  roleId: number;

  @Column({ comment: '菜单ID', type: 'bigint' })
  menuId: number;
}
