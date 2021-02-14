import { MemoryCacheAdapter } from './memory-cache-adapter'
import { RedisCacheAdapter } from './regis-cache-adapter'

export enum CacheTypes {
  Redis = 'Redis',
  Memory = 'Memory'
}

export class CacheFactory {
  public static getCacheAdapter (type: CacheTypes): MemoryCacheAdapter | RedisCacheAdapter {
    switch (type) {
      case CacheTypes.Memory:
        return MemoryCacheAdapter.getInstance()
      case CacheTypes.Redis:
        return new RedisCacheAdapter()
    }
  }
}
