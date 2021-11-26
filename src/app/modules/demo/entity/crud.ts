import { EntityModel } from '@midwayjs/orm';
import { BaseEntity, CoolEntityCrud } from 'midwayjs-cool-core';
import { Column, SelectQueryBuilder } from 'typeorm';
import { DemoGoodsEntity } from './goods';

/**
 * 实体类crud demo
 */
@CoolEntityCrud({
  pageQueryOp: {
    fieldEq: ['name'],
    select: ['a.*', 'b.id as price'],
    join: [
      {
        entity: DemoGoodsEntity,
        alias: 'b',
        condition: 'a.id = b.id',
        type: 'innerJoin',
      },
    ],
    other: async (find: SelectQueryBuilder<DemoCrudEntity>) => {
      find.groupBy('a.id');
    },
  },
})
@EntityModel('demo_crud')
export class DemoCrudEntity extends BaseEntity {
  @Column({ comment: '头像' })
  headImg: string;

  @Column({ comment: '姓名' })
  name: string;

  @Column({ comment: '年龄' })
  age: number;

  @Column({ type: 'tinyint', comment: '性别 0-未知 1-男 2-女', default: 0 })
  type: number;
}
