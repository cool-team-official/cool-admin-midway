import { CoolIotConfig } from './interface';
import {
  App,
  Config,
  getClassMetadata,
  ILogger,
  IMidwayApplication,
  listModule,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { COOL_MQTT_EVENT_KEY, COOL_MQTT_KEY } from './decorator/mqtt';
import Aedes, { AedesOptions } from 'aedes';
import { randomUUID } from 'crypto';

/**
 * MQTT服务
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolMqttServe {
  @Config('cool.iot')
  coolIotConfig: CoolIotConfig;

  @Logger()
  coreLogger: ILogger;

  serve: Aedes;

  @App()
  app: IMidwayApplication;

  async init() {
    await this.initServe();
    await this.handlerCls();
    await this.startServe();
  }

  /**
   * 开启服务
   */
  async startServe() {
    const { port, wsPort } = this.coolIotConfig;
    const { createServer } = require('aedes-server-factory');
    const server = createServer(this.serve);

    const serverWs = createServer(this.serve, { ws: true });

    server.listen(port, () => {
      this.coreLogger.info(
        `\x1B[36m [cool:iot] MQTT serve started port: ${port} \x1B[0m`
      );
    });

    serverWs.listen(wsPort, () => {
      this.coreLogger.info(
        `\x1B[36m [cool:iot] MQTT websocket serve started port: ${wsPort} \x1B[0m`
      );
    });
  }

  /**
   * 初始化服务
   */
  async initServe() {
    const { redis } = this.coolIotConfig;
    let option = {} as AedesOptions;
    // cluster模式下必须配置redis
    if (redis) {
      const mqredis = require('@cool-midway/mqemitter-redis');
      const mq = mqredis(redis);
      option.id = randomUUID();
      // redis cluster模式
      if (redis instanceof Array) {
        option.persistence = require('aedes-persistence-redis')({
          cluster: redis,
          maxSessionDelivery: 1000, // maximum offline messages deliverable on client CONNECT, default is 1000
        });
      } else {
        option.persistence = require('aedes-persistence-redis')({
          ...redis,
          maxSessionDelivery: 1000, // maximum offline messages deliverable on client CONNECT, default is 1000
        });
      }
      option = {
        id: randomUUID(),
        mq,
      };
    }
    this.serve = require('aedes')(option);

    // 认证
    if (this.coolIotConfig.auth) {
      const auth = this.coolIotConfig.auth;
      this.serve.authenticate = function (
        client,
        username,
        password,
        callback
      ) {
        callback(
          null,
          username === auth.username && password.toString() === auth.password
        );
      };
    }
  }

  /**
   * 处理类
   */
  async handlerCls() {
    const eventModules = listModule(COOL_MQTT_KEY);
    for (const module of eventModules) {
      this.handlerEvent(module);
    }
  }

  /**
   * 处理事件
   * @param module
   */
  async handlerEvent(module) {
    const events = getClassMetadata(COOL_MQTT_EVENT_KEY, module);
    for (const event of events) {
      const method = event.eventName ? event.eventName : event.propertyKey;
      this.serve.on(method, async (...args) => {
        const moduleInstance = await this.app
          .getApplicationContext()
          .getAsync(module);
        moduleInstance[event.propertyKey](...args);
      });
    }
  }

  /**
   * 发送消息
   * @param topic 话题
   * @param message 消息
   * @param other 其他配置
   */
  async publish(topic, message, other?) {
    this.serve.publish(
      {
        cmd: 'publish',
        qos: 2,
        dup: false,
        topic,
        payload: Buffer.from(message),
        retain: false,
        ...this.coolIotConfig.publish,
        ...other,
      },
      error => {
        if (error) {
          this.coreLogger.error('publish fail', error);
        }
      }
    );
  }
}
