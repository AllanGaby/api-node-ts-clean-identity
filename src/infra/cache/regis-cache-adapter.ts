import { EnvConfig } from '@/main/config/env'
import Redis, { Redis as RedisClient } from 'ioredis'
import { CacheCreate, CacheRecover, CacheRemove, CacheRemoveByPrefix } from '@/data/protocols/cache'

export class RedisCacheAdapter implements CacheCreate, CacheRecover, CacheRemove, CacheRemoveByPrefix {
  private readonly client: RedisClient

  constructor () {
    this.client = new Redis(EnvConfig.redisConfig)
  }

  async create (key: string, record: object): Promise<void> {
    this.client.set(key, JSON.stringify(record))
  }

  async recover<ResultType = any>(key: string): Promise<ResultType> {
    const record = await this.client.get(key)
    if (record) {
      return JSON.parse(record)
    }
    return undefined
  }

  async remove (key: string): Promise<void> {
    await this.client.del(key)
  }

  async removeByPrefix (prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()
    keys.forEach(key => pipeline.del(key))
    await pipeline.exec()
  }
}
