import { BaseEntity } from '@cool-midway/core';
import { BeforeRemove, Column, Entity, Index } from 'typeorm';

/**
 * 商品模块-商品信息
 */
@Entity('demo_goods')
export class DemoGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '标题', length: 50 })
  title: string;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  price: number;

  @Column({ comment: '描述', nullable: true })
  description: string;

  @Column({ comment: '主图', nullable: true })
  mainImage: string;

  @Column({ comment: '示例图', nullable: true, type: 'json' })
  exampleImages: string[];

  @Column({ comment: '库存', default: 0 })
  stock: number;
}
