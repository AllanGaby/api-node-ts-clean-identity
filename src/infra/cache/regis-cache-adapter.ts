import Redis, { Redis as RedisClient, RedisOptions } from 'ioredis'
import { CacheCreate, CacheCreateDTO, CacheRecover, CacheRemove, CacheRemoveByPrefix } from '@/data/protocols/cache'

export class RedisCacheAdapter implements CacheCreate, CacheRecover, CacheRemove, CacheRemoveByPrefix {
  client: RedisClient

  constructor (options: RedisOptions) {
    options.password = undefined
    this.client = new Redis(options)
  }

  async create ({ key, record }: CacheCreateDTO): Promise<void> {
    await this.client.set(key, JSON.stringify(record))
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
