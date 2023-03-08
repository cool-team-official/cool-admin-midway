import { BaseEntity } from '@cool-midway/core';
import { Column, Index, Entity } from 'typeorm';

/**
 * 文件空间信息
 */
@Entity('space_info')
export class SpaceInfoEntity extends BaseEntity {
  @Column({ comment: '地址' })
  url: string;

  @Column({ comment: '类型' })
  type: string;

  @Column({ comment: '分类ID', type: 'bigint', nullable: true })
  classifyId: number;

  @Index()
  @Column({ comment: '文件id' })
  fileId: string;

  @Column({ comment: '文件名' })
  name: string;

  @Column({ comment: '文件大小' })
  size: number;

  @Column({ comment: '文档版本', default: 1 })
  version: number;

  @Column({ comment: '文件位置' })
  key: string;
}
