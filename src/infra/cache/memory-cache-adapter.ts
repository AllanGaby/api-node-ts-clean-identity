import { CacheCreate, CacheRecover, CacheRemove, CacheRemoveByPrefix } from '@/data/protocols/cache'

interface RecordsType {
  [key: string]: string
}

export class MemoryCacheAdapter implements CacheCreate, CacheRecover, CacheRemove, CacheRemoveByPrefix {
  records: RecordsType

  constructor () {
    this.records = {}
  }

  async create (key: string, record: object): Promise<void> {
    this.records[key] = JSON.stringify(record)
  }

  async recover<ResultType = any>(key: string): Promise<ResultType> {
    const record = this.records[key]
    if (record) {
      return JSON.parse(record)
    }
    return undefined
  }

  async remove (key: string): Promise<void> {
    this.records[key] = undefined
  }

  async removeByPrefix (prefix: string): Promise<void> {
    const keys = Object.keys(this.records)

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        this.records[key] = undefined
      }
    })
  }
}
