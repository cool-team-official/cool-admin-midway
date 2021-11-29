import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';

/**
 * 部门
 */
@EntityModel('base_sys_department')
export class BaseSysDepartmentEntity extends BaseEntity {
  @Column({ comment: '部门名称' })
  name: string;

  @Column({ comment: '上级部门ID', type: 'bigint', nullable: true })
  parentId: number;

  @Column({ comment: '排序', default: 0 })
  orderNum: number;
  // 父菜单名称
  parentName: string;
}
