import { IotMessageEntity } from './../entity/message';
import { IotDeviceEntity } from './../entity/device';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Provide, Singleton } from '@midwayjs/core';

/**
 * 消息
 */
@Provide()
@Singleton()
export class IotMessageService extends BaseService {
  @InjectEntityModel(IotDeviceEntity)
  iotDeviceEntity: Repository<IotDeviceEntity>;

  @InjectEntityModel(IotMessageEntity)
  iotMessageEntity: Repository<IotMessageEntity>;

  /**
   * 记录消息
   * @param uniqueId 设备唯一ID
   * @param data 数据
   * @param type 类型 0-推送 1-接收
   */
  async record(uniqueId: string, data: string, type: number) {
    const device = await this.iotDeviceEntity.findOneBy({ uniqueId });
    if (device) {
      await this.iotMessageEntity.insert({ deviceId: device.id, data, type });
    }
  }
}
