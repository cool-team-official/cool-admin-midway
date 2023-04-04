import { createCustomMethodDecorator } from "@midwayjs/decorator";

// 装饰器内部的唯一 id
export const COOL_CACHE = "decorator:cool_cache";

export function CoolCache(ttl?: number): MethodDecorator {
  return createCustomMethodDecorator(COOL_CACHE, ttl);
}
