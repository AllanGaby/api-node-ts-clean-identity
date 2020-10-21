import { GetAccountByEmailRepositorySpy, CreateSessionRepositorySpy, throwError, mockAccountModel } from '@/data/test'
import { DbRequestRecoverPassword } from './request-recover-password'
import faker from 'faker'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbRequestRecoverPassword
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  createSessionRepositorySpy: CreateSessionRepositorySpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  getAccountByEmailRepositorySpy.account = mockAccountModel()
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const sut = new DbRequestRecoverPassword(getAccountByEmailRepositorySpy, createSessionRepositorySpy)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    createSessionRepositorySpy
  }
}

describe('DbRequestRecoverPassword', () => {
  test('Should call GetAccountByEmailRepository with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const email = faker.internet.email()
    await sut.request({ email })
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(email)
  })

  test('Should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.request({ email: faker.internet.email() })
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByEmailRepository return null', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    getAccountByEmailRepositorySpy.account = null
    const email = faker.internet.email()
    const sendMail = await sut.request({ email })
    expect(sendMail).toBeFalsy()
  })

  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy, getAccountByEmailRepositorySpy } = makeSut()
    await sut.request({ email: faker.internet.email() })
    expect(createSessionRepositorySpy.addSessionParams.accountId).toBe(getAccountByEmailRepositorySpy.account.id)
    expect(createSessionRepositorySpy.addSessionParams.type).toBe(SessionType.recoverPassword)
  })
})
