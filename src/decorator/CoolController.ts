import { Scope, ScopeEnum, saveClassMetadata, saveModule } from '@midwayjs/decorator';

const MODEL_KEY = 'decorator:model';

export function CoolController(): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(MODEL_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(
      MODEL_KEY,
      {
        test: 'abc'
      },
      target
    );
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Request)(target);
  };
}