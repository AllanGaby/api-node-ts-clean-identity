import { GetAccountByEmailRepositorySpy, throwError } from '@/data/test'
import { DbRequestRecoverPassword } from './request-recover-password'
import faker from 'faker'

interface sutTypes {
  sut: DbRequestRecoverPassword
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const sut = new DbRequestRecoverPassword(getAccountByEmailRepositorySpy)
  return {
    sut,
    getAccountByEmailRepositorySpy
  }
}

describe('DbRequestRecoverPassword', () => {
  test('Should call GetAccountByEmailRepository with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const email = faker.internet.email()
    await sut.request({ email })
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(email)
  })

  test('Should throw if GetSessionByIdRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.request({ email: faker.internet.email() })
    await expect(promise).rejects.toThrow()
  })
})
