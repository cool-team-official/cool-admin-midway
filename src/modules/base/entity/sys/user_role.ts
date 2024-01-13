import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 用户角色
 */
@Entity('base_sys_user_role')
export class BaseSysUserRoleEntity extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '角色ID' })
  roleId: number;
}
