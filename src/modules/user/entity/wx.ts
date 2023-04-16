import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 微信用户
 */
@Entity('user_wx')
export class UserWxEntity extends BaseEntity {
  @Index()
  @Column({ comment: '微信unionid', nullable: true })
  unionid: string;

  @Index()
  @Column({ comment: '微信openid' })
  openid: string;

  @Column({ comment: '头像', nullable: true })
  avatarUrl: string;

  @Column({ comment: '昵称', nullable: true })
  nickName: string;

  @Column({ comment: '性别 0-未知 1-男 2-女', default: 0 })
  gender: number;

  @Column({ comment: '语言', nullable: true })
  language: number;

  @Column({ comment: '城市', nullable: true })
  city: number;

  @Column({ comment: '省份', nullable: true })
  province: number;

  @Column({ comment: '国家', nullable: true })
  country: number;
}
