import { CacheCreate, CacheRecover } from '@/data/protocols/cache'

interface RecordsType {
  [key: string]: string
}

export class MemoryCacheAdapter implements CacheCreate, CacheRecover {
  records: RecordsType

  constructor () {
    this.records = {}
  }

  async create (key: string, record: object): Promise<void> {
    this.records[key] = JSON.stringify(record)
  }

  async recover<ResultType = any> (key: string): Promise<ResultType> {
    const record = this.records[key]
    if (record) {
      return JSON.parse(record)
    }
    return undefined
  }
}
