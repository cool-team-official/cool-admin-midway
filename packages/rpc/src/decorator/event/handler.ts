import { attachClassMetadata } from '@midwayjs/decorator';

export const COOL_RPC_EVENT_HANDLER_KEY = 'decorator:cool:rpc:event:handler';

/**
 * 事件
 * @param eventName 事件名称
 * @returns
 */
export function CoolRpcEventHandler(eventName?: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    attachClassMetadata(
      COOL_RPC_EVENT_HANDLER_KEY,
      {
        propertyKey,
        descriptor,
        eventName,
      },
      target
    );
  };
}
