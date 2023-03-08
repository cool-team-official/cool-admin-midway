import { CloudReq } from '@cool-midway/cloud';
import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 云函数日志
 */
@Entity('cloud_func_log')
export class CloudFuncLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '云函数ID' })
  infoId: number;

  @Column({ comment: '请求', type: 'json', nullable: true })
  request: CloudReq;

  @Column({ comment: '结果', type: 'json', nullable: true })
  result: string;

  @Column({ comment: '类型 0-失败 1-成功', default: 1, type: 'tinyint' })
  type: number;

  @Column({ comment: '异常信息', nullable: true, type: 'text' })
  error: string;

  @Column({ comment: '耗时(毫秒)', default: 0 })
  time: number;
}
