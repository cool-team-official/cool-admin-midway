import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 云数据库
 */
@Entity('cloud_db')
export class CloudDBEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '说明', nullable: true })
  readme: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Index({ unique: true })
  @Column({ comment: '类名', nullable: true })
  className: string;

  @Index({ unique: true })
  @Column({ comment: '表名', nullable: true })
  tableName: string;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
