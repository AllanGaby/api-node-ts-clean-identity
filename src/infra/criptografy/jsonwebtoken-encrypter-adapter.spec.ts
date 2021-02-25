import { JWTEncrypterAdapter } from './jsonwebtoken-encrypter-adapter'
import jsonwebtoken from 'jsonwebtoken'
import { throwError } from '@/data/tests'
import faker from 'faker'

interface sutTypes {
  sut: JWTEncrypterAdapter
  secret: string
  deadlineInDays: number
}

const makeSut = (): sutTypes => {
  const secret = faker.random.uuid()
  const deadlineInDays = faker.random.number()
  const sut = new JWTEncrypterAdapter(secret, deadlineInDays)
  return {
    sut,
    secret,
    deadlineInDays
  }
}

describe('JWTEncrypterAdapter', () => {
  describe('encrypt', () => {
    test('Should call sign with correct value', async () => {
      const { sut, secret, deadlineInDays } = makeSut()
      const signSpyon = jest.spyOn(jsonwebtoken, 'sign')
      const plainText = faker.random.words()
      await sut.encrypt(plainText)
      expect(signSpyon).toHaveBeenCalledWith({}, secret, {
        subject: plainText,
        expiresIn: `${deadlineInDays}d`
      })
    })

    test('Should return throw if sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(throwError)
      const promise = sut.encrypt(faker.random.words())
      await expect(promise).rejects.toThrow()
    })

    test('Should return same value of sign', async () => {
      const { sut } = makeSut()
      const jwt = faker.random.uuid()
      jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce((payload: string, secretKey: string, options: object) => { return jwt })
      const result = await sut.encrypt(faker.random.words())
      expect(result).toEqual(jwt)
    })
  })

  describe('decrypt', () => {
    test('Should call verify with correct values', async () => {
      const { sut, secret } = makeSut()
      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce((token: string, secretKey: string) => { return {} })
      const verifySpyon = jest.spyOn(jsonwebtoken, 'verify')
      const encryptedText = faker.random.uuid()
      await sut.decrypt(encryptedText)
      expect(verifySpyon).toHaveBeenCalledWith(encryptedText, secret)
    })

    test('Should return throw if verify throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce(throwError)
      const promise = sut.decrypt(faker.random.words())
      await expect(promise).rejects.toThrow()
    })

    test('Should return correct value if verify is success', async () => {
      const { sut } = makeSut()
      const tokenPayload = {
        sub: faker.random.uuid()
      }
      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce((token: string, secretKey: string) => { return tokenPayload })
      const result = await sut.decrypt(faker.random.words())
      expect(result).toEqual(tokenPayload.sub)
    })
  })
})
