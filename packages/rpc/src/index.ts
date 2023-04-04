export { CoolRpcConfiguration as Configuration } from './configuration';

export * from './test';
export * from './rpc';
export * from './decorator/rpc';
export * from './decorator/event/event';
export * from './decorator/event/handler';
export * from './service/base';
export * from './decorator/transaction';
export * from './transaction/event';
export * from './decorator/index';

export interface CoolRpcConfig {
  // 服务名称
  name: string;
  // redis
  redis: RedisConfig & RedisConfig[] & unknown;
}

export interface RedisConfig {
  host: string;
  password: string;
  port: number;
  db: number;
}
