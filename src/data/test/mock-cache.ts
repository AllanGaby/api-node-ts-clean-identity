import { CacheCreate, CacheRecover } from '@/data/protocols/cache'

export class CacheCreateSpy implements CacheCreate {
  key: string
  record: object

  async create (key: string, record: object): Promise<void> {
    this.key = key
    this.record = record
  }
}

export class CacheRecoverSpy implements CacheRecover {
  key: string
  result: any

  async recover<ResultType = any> (key: string): Promise<ResultType> {
    this.key = key
    return this.result
  }
}
