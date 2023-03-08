import { IotMessageService } from './../service/message';
import { IotDeviceService } from './../service/device';
import { ILogger, Inject } from '@midwayjs/core';
import { CoolMqtt, CoolMqttEvent, CoolMqttServe } from '@cool-midway/iot';

/**
 * 应用事件
 */
@CoolMqtt()
export class IotMQTTEvent {
  @Inject()
  iotDeviceService: IotDeviceService;

  @Inject()
  iotMessageService: IotMessageService;

  @Inject()
  logger: ILogger;

  @Inject()
  coolMqttServe: CoolMqttServe;

  /**
   * 客户端连接
   * @param client
   */
  @CoolMqttEvent('client')
  async client(client) {
    this.logger.info('mqtt client event clientId:', client.id);
  }

  /**
   * 发送消息
   * @param packet
   * @param client
   */
  @CoolMqttEvent('publish')
  async publish(packet, client) {
    if (packet.cmd) {
      //   console.log(11);
      await this.iotMessageService.record(
        packet.topic,
        packet.payload.toString(),
        packet.properties?.contentType == 'push' ? 0 : 1
      );
      if (
        !packet.topic.includes('@admin') &&
        packet.properties?.contentType != 'push'
      ) {
        this.coolMqttServe.publish(
          `${packet.topic}@admin`,
          packet.payload.toString()
        );
      }
    }
  }

  /**
   * 订阅事件 注册设备
   * @param subscriptions
   * @param client
   */
  @CoolMqttEvent('subscribe')
  async subscribe(subscriptions, client) {
    await this.iotDeviceService.register(subscriptions[0].topic, client.id);
  }

  /**
   * 取消订阅
   * @param subscriptions
   * @param client
   */
  @CoolMqttEvent('unsubscribe')
  async unsubscribe(subscriptions, client) {
    await this.iotDeviceService.changeStatus(subscriptions[0], 0);
  }

  /**
   * 断开连接
   * @param client
   */
  @CoolMqttEvent('clientDisconnect')
  async clientDisconnect(client) {
    this.logger.info('mqtt clientDisconnect event clientId:', client.id);
  }
}
