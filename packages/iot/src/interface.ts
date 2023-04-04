import { AedesOptions } from 'aedes';
import { PublishPacket } from 'packet';

/**
 * MQTT配置
 */
export interface CoolIotConfig {
  /** MQTT服务端口 */
  port: number;
  /** MQTT Websocket服务端口 */
  wsPort: number;
  /** redis 配置 mqtt cluster下必须要配置 */
  redis?: {
    /** host */
    host: string;
    /** port */
    port: number;
    /** password */
    password: string;
    /** db */
    db: number;
  };
  /** 发布消息配置 */
  publish?: PublishPacket;
  /** 认证 */
  auth?: {
    /** 用户 */
    username: string;
    /** 密码 */
    password: string;
  };
  /** 服务配置 */
  serve?: AedesOptions;
}
