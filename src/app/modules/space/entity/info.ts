import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

/**
 * 文件空间信息
 */
@EntityModel('base_app_space_info')
export class BaseAppSpaceInfoEntity extends BaseEntity {
  @Column({ comment: '地址' })
  url: string;

  @Column({ comment: '类型' })
  type: string;

  @Column({ comment: '分类ID', type: 'bigint', nullable: true })
  classifyId: number;
}
