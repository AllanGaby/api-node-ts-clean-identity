import { MemoryCacheAdapter } from './memory-cache-adapter'
import { RedisCacheAdapter } from './regis-cache-adapter'
import { CacheOptions } from '@/main/config/environment'

export enum CacheTypes {
  Redis = 'Redis',
  Memory = 'Memory'
}

export class CacheFactory {
  public static getCacheAdapter (type: CacheTypes, options: CacheOptions): MemoryCacheAdapter | RedisCacheAdapter {
    switch (type) {
      case CacheTypes.Memory:
        return MemoryCacheAdapter.getInstance()
      case CacheTypes.Redis:
        return new RedisCacheAdapter(options)
    }
  }
}
