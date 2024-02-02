import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户信息
 */
@Entity('user_info')
export class UserInfoEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '登录唯一ID', nullable: true })
  unionid: string;

  @Column({ comment: '头像', nullable: true })
  avatarUrl: string;

  @Column({ comment: '昵称', nullable: true })
  nickName: string;

  @Index({ unique: true })
  @Column({ comment: '手机号', nullable: true })
  phone: string;

  @Column({ comment: '性别 0-未知 1-男 2-女', default: 0 })
  gender: number;

  @Column({ comment: '状态 0-禁用 1-正常 2-已注销', default: 1 })
  status: number;

  @Column({ comment: '登录方式 0-小程序 1-公众号 2-H5', default: 0 })
  loginType: number;

  @Column({ comment: '密码', nullable: true })
  password: string;
}
