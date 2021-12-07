import { EntityModel } from '@midwayjs/orm';
import { BaseEntity, CoolEntityCrud } from '@cool-midway/core';
import { Column } from 'typeorm';

/**
 * 实体类crud demo
 */
@CoolEntityCrud()
@EntityModel('demo_user')
export class DemoUserEntity extends BaseEntity {
  @Column({ comment: '头像' })
  headImg: string;

  @Column({ comment: '姓名' })
  name: string;

  @Column({ comment: '年龄' })
  age: number;

  @Column({ comment: '出生日期' })
  birthDate: Date;

  @Column({
    type: 'tinyint',
    comment: '性别 0-未知 1-男 2-女',
    default: 0,
  })
  type: number;

  @Column({ comment: '介绍', nullable: true })
  introduce: string;
}
