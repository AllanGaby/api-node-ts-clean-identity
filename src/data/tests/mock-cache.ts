import { CacheCreate, CacheCreateDTO, CacheRecover, CacheRemove, CacheRemoveByPrefix } from '@/data/protocols/cache'

export class CacheCreateStub implements CacheCreate {
  params: CacheCreateDTO

  async create (params: CacheCreateDTO): Promise<void> {
    this.params = params
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

  async remove (key: string): Promise<void> {
    this.key = key
  }
}

export class CacheRemoveByPrefixSpy implements CacheRemoveByPrefix {
  prefix: string

  async removeByPrefix (prefix: string): Promise<void> {
    this.prefix = prefix
  }
}
