import { BaseEntity } from '@cool-midway/core';
import { Column, Index, Entity } from 'typeorm';

/**
 * 参数配置
 */
@Entity('base_sys_param')
export class BaseSysParamEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '键' })
  keyName: string;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '数据', type: 'text' })
  data: string;

  @Column({
    comment: '数据类型 0-字符串 1-富文本 2-文件 ',
    default: 0,
    type: 'tinyint',
  })
  dataType: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;
}
