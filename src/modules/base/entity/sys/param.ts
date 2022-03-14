import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column, Index } from 'typeorm';

/**
 * 参数配置
 */
@EntityModel('base_sys_param')
export class BaseSysParamEntity extends BaseEntity {
  @Index()
  @Column({ comment: '键位' })
  keyName: string;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '数据', type: 'text' })
  data: string;

  @Column({
    comment: '数据类型 0:字符串 1：数组 2：键值对',
    default: 0,
    type: 'tinyint',
  })
  dataType: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;
}
