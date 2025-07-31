import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { InjectClient, Provide, Scope, ScopeEnum } from '@midwayjs/core';

/**
 * 缓存类
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class CacheStore {
  @Inject()
  cache: MidwayCache;
  @InjectClient(CachingFactory, 'memory')
  memory: MidwayCache;

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    return this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    return this.cache.del(key);
  }

  async reset(): Promise<void> {
    return this.cache.reset();
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    return this.cache.wrap(key, fn, ttl);
  }

  methodWrap<T>(
    key: string,
    fn: (...args: any[]) => Promise<T>,
    fnArgs: any[],
    ttl?: any
  ): Promise<T> {
    return this.cache.methodWrap(key, fn, fnArgs, ttl);
  }

  get store() {
    return this.cache.store;
  }
}
