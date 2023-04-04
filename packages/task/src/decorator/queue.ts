import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule,
} from '@midwayjs/decorator';
import { JobsOptions } from 'bullmq';

export const COOL_TASK_KEY = 'decorator:cool:task';

export function CoolQueue(
  config = { type: 'comm', queue: {}, worker: {} } as {
    type?: 'comm' | 'getter' | 'noworker' | 'single';
    queue?: JobsOptions;
    worker?: WorkerOptions;
  }
): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(COOL_TASK_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(COOL_TASK_KEY, config, target);
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Singleton)(target);
  };
}
