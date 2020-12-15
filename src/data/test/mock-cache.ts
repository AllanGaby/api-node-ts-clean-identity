import { CacheCreate } from '@/data/protocols/cache'

export class CacheCreateSpy implements CacheCreate {
  key: string
  record: object

  async create (key: string, record: object): Promise<void> {
    this.key = key
    this.record = record
  }
}
