import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 微信用户
 */
@Entity('user_wx')
export class UserWxEntity extends BaseEntity {
  @Column({ comment: '头像', nullable: true })
  avatarUrl: number;

  @Column({ comment: '昵称', nullable: true })
  nickName: string;

  @Column({ comment: '性别 0-未知 1-男 2-女', default: 0 })
  gender: number;

  @Column({ comment: '语言' })
  language: number;

  @Column({ comment: '城市' })
  city: number;

  @Column({ comment: '省份' })
  province: number;

  @Column({ comment: '国家' })
  country: number;
}
