import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule,
} from '@midwayjs/decorator';

export const COOL_RPC_EVENT_KEY = 'decorator:cool:rpc:event';

export function CoolRpcEvent(): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(COOL_RPC_EVENT_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(COOL_RPC_EVENT_KEY, {}, target);
    // 指定 IoC 容器创建实例的作用域
    Scope(ScopeEnum.Singleton)(target);
  };
}
