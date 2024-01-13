import { BaseEntity } from '@cool-midway/core';
import { Entity, Column, Index } from 'typeorm';

/**
 * 数据回收站 软删除的时候数据会回收到该表
 */
@Entity('recycle_data')
export class RecycleDataEntity extends BaseEntity {
  @Column({ comment: '表', type: 'json' })
  entityInfo: {
    // 数据源名称
    dataSourceName: string;
    // entity
    entity: string;
  };

  @Index()
  @Column({ comment: '操作人', nullable: true })
  userId: number;

  @Column({ comment: '被删除的数据', type: 'json' })
  data: object[];

  @Column({ comment: '请求的接口', nullable: true })
  url: string;

  @Column({ comment: '请求参数', nullable: true, type: 'json' })
  params: string;

  @Column({ comment: '删除数据条数', default: 1 })
  count: number;
}
