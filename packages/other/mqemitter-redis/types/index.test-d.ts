import { expectError, expectType } from 'tsd';
import mqEmitterRedis, { Message, MQEmitterRedis } from '.';

expectType<MQEmitterRedis>(mqEmitterRedis());

expectType<MQEmitterRedis>(
  mqEmitterRedis({ concurrency: 200, matchEmptyLevels: true })
);

expectType<MQEmitterRedis>(
  mqEmitterRedis({
    concurrency: 10,
    matchEmptyLevels: true,
    separator: '/',
    wildcardOne: '+',
    wildcardSome: '#',
    connectionString: 'redis://:authpassword@127.0.0.1:6380/4',
  })
);

expectType<MQEmitterRedis>(
  mqEmitterRedis({
    concurrency: 10,
    matchEmptyLevels: true,
    host: 'localhost',
    port: 6379,
    reconnectOnError: (error: Error) => true,
    retryStrategy: (times: number) => times * 1.5,
  })
);

function listener(message: Message, done: () => void) {}

expectType<MQEmitterRedis>(mqEmitterRedis().on('topic', listener));

expectType<void>(mqEmitterRedis().removeListener('topic', listener));

expectError(mqEmitterRedis().emit(null));

expectType<void>(mqEmitterRedis().emit({ topic: 'test', prop1: 'prop1' }));

expectType<void>(mqEmitterRedis().close(() => null));
