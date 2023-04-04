import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule,
  attachClassMetadata,
} from '@midwayjs/core';

export const COOL_MQTT_KEY = 'decorator:cool:cls:mqtt';

export function CoolMqtt(): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(COOL_MQTT_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(COOL_MQTT_KEY, {}, target);
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Singleton)(target);
  };
}

export const COOL_MQTT_EVENT_KEY = 'decorator:cool:mqtt:event';

/**
 * 事件
 * @param eventName
 * @returns
 */
export function CoolMqttEvent(eventName?: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    attachClassMetadata(
      COOL_MQTT_EVENT_KEY,
      {
        eventName,
        propertyKey,
        descriptor,
      },
      target
    );
  };
}
