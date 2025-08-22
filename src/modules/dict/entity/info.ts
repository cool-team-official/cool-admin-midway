import { BaseEntity } from '../../base/entity/base';
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

  @Column({ comment: 'el-tag类型', nullable: true, default: '' })
  type: string;

  @Column({ comment: 'el-tag颜色', nullable: true, default: '' })
  color: string;
}
