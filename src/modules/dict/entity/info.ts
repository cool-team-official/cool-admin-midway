import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 字典信息
 */
@Entity('dict_info')
export class DictInfoEntity extends BaseEntity {
  @Column({ comment: '类型ID' })
  typeId: number;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '值', nullable: true })
  value: string;

  @Column({ comment: '排序', default: 0 })
  orderNum: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Column({ comment: '父ID', default: null })
  parentId: number;
}
