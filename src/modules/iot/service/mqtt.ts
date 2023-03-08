import { CoolMqttServe } from '@cool-midway/iot';
import { IotMessageEntity } from './../entity/message';
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolIotConfig } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * MQTT
 */
@Provide()
export class IotMqttService extends BaseService {
  @InjectEntityModel(IotMessageEntity)
  iotMessageEntity: Repository<IotMessageEntity>;

  @Config('cool.iot')
  coolIotConfig: CoolIotConfig;

  @Inject()
  coolMqttServe: CoolMqttServe;

  /**
   * 配置信息
   */
  async config() {
    return {
      port: this.coolIotConfig.port,
    };
  }

  /**
   * 推送消息
   * @param uniqueId 设备唯一ID
   * @param data 推送数据
   */
  async publish(uniqueId: string, data: string) {
    await this.coolMqttServe.publish(uniqueId, data, {
      properties: {
        contentType: 'push',
      },
    });
  }
}
