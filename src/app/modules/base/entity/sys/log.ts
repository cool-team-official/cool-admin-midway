import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column, Index } from 'typeorm';

/**
 * 系统日志
 */
@EntityModel('base_sys_log')
export class BaseSysLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', nullable: true, type: 'bigint' })
  userId: number;

  @Index()
  @Column({ comment: '行为', length: 100 })
  action: string;

  @Index()
  @Column({ comment: 'ip', nullable: true, length: 50 })
  ip: string;

  @Index()
  @Column({ comment: 'ip地址', nullable: true, length: 50 })
  ipAddr: string;

  @Column({ comment: '参数', nullable: true, type: 'text' })
  params: string;
}
