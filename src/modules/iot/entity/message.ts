import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 设备消息
 */
@Entity('iot_message')
export class IotMessageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '设备ID' })
  deviceId: number;

  @Column({ comment: '数据' })
  data: string;

  @Index()
  @Column({ comment: '类型 0-推送 1-接收', default: 1 })
  type: number;
}
