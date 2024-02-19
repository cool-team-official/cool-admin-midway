import { BaseEntity } from '@cool-midway/core';
import { Entity, Column, Index } from 'typeorm';

/**
 * 用户模块-收货地址
 */
@Entity('user_address')
export class UserAddressEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '联系人' })
  contact: string;

  @Index()
  @Column({ comment: '手机号', length: 11 })
  phone: string;

  @Column({ comment: '省' })
  province: string;

  @Column({ comment: '市' })
  city: string;

  @Column({ comment: '区' })
  district: string;

  @Column({ comment: '地址' })
  address: string;

  @Column({ comment: '是否默认', default: false })
  isDefault: boolean;
}
