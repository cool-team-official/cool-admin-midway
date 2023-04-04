import type { RedisOptions } from 'ioredis';
import type { MQEmitter } from 'mqemitter';

export interface MQEmitterOptions {
  concurrency?: number;
  matchEmptyLevels?: boolean;
  separator?: string;
  wildcardOne?: string;
  wildcardSome?: string;
  connectionString?: string;
}

export type Message = Record<string, any> & { topic: string };

export interface MQEmitterRedis extends MQEmitter {
  new (options?: MQEmitterOptions & RedisOptions): MQEmitterRedis;
  current: number;
  concurrent: number;
  on(
    topic: string,
    listener: (message: Message, done: () => void) => void,
    callback?: () => void
  ): this;
  emit(message: Message, callback?: (error?: Error) => void): void;
  removeListener(
    topic: string,
    listener: (message: Message, done: () => void) => void,
    callback?: () => void
  ): void;
  close(callback: () => void): void;
}

declare function MQEmitterRedis(
  options?: MQEmitterOptions & RedisOptions
): MQEmitterRedis;

export default MQEmitterRedis;
