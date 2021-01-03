import { CacheCreate, CacheRecover, CacheRemove } from '@/data/protocols/cache'

export class CacheCreateSpy implements CacheCreate {
  key: string
  record: object

  async create(key: string, record: object): Promise<void> {
    this.key = key
    this.record = record
  }
}

export class CacheRecoverSpy implements CacheRecover {
  key: string
  result: any = null

  async recover<ResultType = any>(key: string): Promise<ResultType> {
    this.key = key
    return this.result
  }
}

export class CacheRemoveSpy implements CacheRemove {
  key: string

  async remove(key: string): Promise<void> {
    this.key = key
  }
}