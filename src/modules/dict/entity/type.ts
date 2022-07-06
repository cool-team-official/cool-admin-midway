import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';

/**
 * 字典类别
 */
@EntityModel('dict_type')
export class DictTypeEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '标识' })
  key: string;
}
