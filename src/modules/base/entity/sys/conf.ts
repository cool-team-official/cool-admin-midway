import { Column, Index } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';

/**
 * 系统配置
 */
@EntityModel('base_sys_conf')
export class BaseSysConfEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '配置键' })
  cKey: string;

  @Column({ comment: '配置值' })
  cValue: string;
}
