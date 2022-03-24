// import { EntityModel } from '@midwayjs/orm';
// import { BaseEntity } from '@cool-midway/core';
// import { Column } from 'typeorm';

// /**
//  * 商品(多数据库连接)
//  */
// @EntityModel('demo_goods_1', {
//   connectionName: 'test',
// })
// export class DemoGoodsTestEntity extends BaseEntity {
//   @Column({ comment: '标题' })
//   title: string;

//   @Column({ comment: '图片' })
//   pic: string;

//   @Column({ comment: '价格', type: 'decimal', precision: 5, scale: 2 })
//   price: number;

//   @Column({ comment: '分类', type: 'tinyint', default: 0 })
//   type: number;
// }
