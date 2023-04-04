import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule,
} from '@midwayjs/decorator';

export const COOL_ES_KEY = 'decorator:cool:es';

export interface EsConfig {
  shards?: number;
  name: string;
  replicas?: number;
  analyzers?: any[];
}

/**
 * 索引
 * @param config
 * @returns
 */
export function CoolEsIndex(
  config: EsConfig | string = {
    name: '',
    replicas: 1,
    shards: 8,
    analyzers: [],
  }
): ClassDecorator {
  if (typeof config == 'string') {
    config = { name: config, replicas: 1, shards: 8, analyzers: [] };
  }
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(COOL_ES_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(COOL_ES_KEY, config, target);
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Singleton)(target);
  };
}
