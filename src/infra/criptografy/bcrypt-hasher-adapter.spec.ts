import { BCrypterHasherAdapter } from './bcrypt-hasher-adapter'
import { throwError } from '@/data/tests'
import { ComparerDTO } from '@/data/protocols/criptography'
import faker from 'faker'
import bcrypt from 'bcrypt'

interface sutTypes {
  sut: BCrypterHasherAdapter
  salt: number
}

const makeSut = (): sutTypes => {
  const salt = faker.random.number({ min: 1, max: 12 })
  const sut = new BCrypterHasherAdapter(salt)
  return {
    sut,
    salt
  }
}

const mockComparerDTO = (): ComparerDTO => ({
  payload: faker.random.words(),
  hashedText: faker.random.uuid()
})

describe('BCrypterHasherAdapter', () => {
  describe('createHash', () => {
    test('Should call hash with correct value', async () => {
      const { sut, salt } = makeSut()
      const hashSpyon = jest.spyOn(bcrypt, 'hash')
      const request = faker.random.words()
      await sut.createHash(request)
      expect(hashSpyon).toHaveBeenCalledWith(request, salt)
    })

    test('Should return throw if hash throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
      const promise = sut.createHash(faker.random.words())
      await expect(promise).rejects.toThrow()
    })

    test('Should return correct hash', async () => {
      const { sut } = makeSut()
      const hash = faker.random.uuid()
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash)
      const result = await sut.createHash(faker.random.words())
      expect(result).toEqual(hash)
    })
  })

  describe('compare', () => {
    test('Should call compare with correct value', async () => {
      const { sut } = makeSut()
      const compareSpyon = jest.spyOn(bcrypt, 'compare')
      const request = mockComparerDTO()
      await sut.compare(request)
      expect(compareSpyon).toHaveBeenCalledWith(request.payload, request.hashedText)
    })

    test('Should return throw if compare throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
      const promise = sut.compare(mockComparerDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should return same value of compare', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true)
      const result = await sut.compare(mockComparerDTO())
      expect(result).toBeTruthy()
    })
  })
})
