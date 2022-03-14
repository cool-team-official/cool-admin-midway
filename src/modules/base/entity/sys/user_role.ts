import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';

/**
 * 用户角色
 */
@EntityModel('base_sys_user_role')
export class BaseSysUserRoleEntity extends BaseEntity {
  @Column({ comment: '用户ID', type: 'bigint' })
  userId: number;

  @Column({ comment: '角色ID', type: 'bigint' })
  roleId: number;
}
