import { RedisCacheAdapter } from './regis-cache-adapter'
import { mockCreateCacheDTO } from '@/infra/tests/cache'
import faker from 'faker'

interface sutTypes {
  sut: RedisCacheAdapter
}

const makeSut = (): sutTypes => {
  return {
    sut: new RedisCacheAdapter({
      host: 'localhost',
      port: 6379,
      password: undefined
    })
  }
}

describe('RedisCacheAdapter', () => {
  afterAll(async () => {
    const { sut } = makeSut()
    await sut.client.flushall()
  })

  describe('Create Method', () => {
    test('Should call set with correct value', async () => {
      const { sut } = makeSut()
      const setSpyon = jest.spyOn(sut.client, 'set')
      const request = mockCreateCacheDTO()
      await sut.create(request)
      expect(setSpyon).toHaveBeenCalledWith(request.key, JSON.stringify(request.record))
    })
  })

  describe('Recover Method', () => {
    test('Should return undefined if key is not found', async () => {
      const { sut } = makeSut()
      const result = await sut.recover(faker.random.uuid())
      expect(result).toBeFalsy()
    })

    test('Should return correct record if key is found', async () => {
      const { sut } = makeSut()
      const request = mockCreateCacheDTO()
      await sut.create(request)

      const result = await sut.recover(request.key)
      expect(result).toEqual(request.record)
    })
  })

  describe('Remove Method', () => {
    test('Should remove correct record', async () => {
      const { sut } = makeSut()
      const request = mockCreateCacheDTO()
      await sut.create(request)
      expect(await sut.client.get(request.key)).toBeTruthy()

      await sut.remove(request.key)
      expect(await sut.client.get(request.key)).toBeFalsy()
    })
  })

  describe('RemoveByPrefix Method', () => {
    test('Should remove correct records starting with prefix', async () => {
      const prefix = faker.random.uuid()
      const { sut } = makeSut()
      const recordWithoutPrefix = mockCreateCacheDTO()
      const recordWithPrefix1 = mockCreateCacheDTO(prefix)
      const recordWithPrefix2 = mockCreateCacheDTO(prefix)
      await sut.create(recordWithoutPrefix)
      await sut.create(recordWithPrefix1)
      await sut.create(recordWithPrefix2)
      expect(await sut.client.get(recordWithoutPrefix.key)).toEqual(JSON.stringify(recordWithoutPrefix.record))
      expect(await sut.client.get(recordWithPrefix1.key)).toEqual(JSON.stringify(recordWithPrefix1.record))
      expect(await sut.client.get(recordWithPrefix2.key)).toEqual(JSON.stringify(recordWithPrefix2.record))

      await sut.removeByPrefix(prefix)
      expect(await sut.client.get(recordWithoutPrefix.key)).toEqual(JSON.stringify(recordWithoutPrefix.record))
      expect(await sut.client.get(recordWithPrefix1.key)).toBeFalsy()
      expect(await sut.client.get(recordWithPrefix2.key)).toBeFalsy()
    })
  })
})
