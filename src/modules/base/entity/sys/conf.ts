import { Column, Index, Entity } from 'typeorm';
import { BaseEntity } from '@cool-midway/core';

/**
 * 系统配置
 */
@Entity('base_sys_conf')
export class BaseSysConfEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '配置键' })
  cKey: string;

  @Column({ comment: '配置值' })
  cValue: string;
}
