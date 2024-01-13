import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 设备
 */
@Entity('iot_device')
export class IotDeviceEntity extends BaseEntity {
  @Column({ comment: '图标', nullable: true })
  icon: string;

  @Column({ comment: '名称' })
  name: string;

  @Index({ unique: true })
  @Column({ comment: '设备唯一ID' })
  uniqueId: string;

  @Index()
  @Column({ comment: '状态 0-离线 1-在线', default: 0 })
  status: number;

  @Column({ comment: '客户端ID', nullable: true })
  clientId: string;
}
