import { CacheCreateDTO } from '@/data/protocols/cache'
import faker from 'faker'

export const mockCreateCacheDTO = (prefix?: string): CacheCreateDTO => {
  if (prefix) {
    return {
      key: `${prefix}-${faker.random.uuid()}`,
      record: faker.random.objectElement<object>()
    }
  }
  return {
    key: faker.random.uuid(),
    record: faker.random.objectElement<object>()
  }
}
