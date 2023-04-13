import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户信息
 */
@Entity('user_info')
export class UserInfoEntity extends BaseEntity {
  @Index()
  @Column({ comment: '第三方登录的唯一ID，如：微信、QQ等' })
  unionid: string;

  @Column({ comment: '头像' })
  avatarUrl: string;

  @Column({ comment: '昵称' })
  nickName: string;

  @Index({ unique: true })
  @Column({ comment: '手机号' })
  phone: string;

  @Column({ comment: '性别 0-未知 1-男 2-女', default: 0 })
  gender: number;

  @Column({ comment: '状态 0-正常 1-禁用', default: 0 })
  status: number;
}
