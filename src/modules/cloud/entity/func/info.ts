import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 云函数
 */
@Entity('cloud_func_info')
export class CloudFuncInfoEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '说明', nullable: true })
  readme: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
