import { CacheCreate, CacheRecover, CacheRemove } from '@/data/protocols/cache'

interface RecordsType {
  [key: string]: string
}

export class MemoryCacheAdapter implements CacheCreate, CacheRecover, CacheRemove {
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
}
