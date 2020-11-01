import { GetAccountByEmailRepositorySpy, throwError, mockAccountModel, SendMailSessionSpy } from '@/data/test'
import { DbRequestRecoverPassword } from './request-recover-password'
import faker from 'faker'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbRequestRecoverPassword
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  sendMailSessionSpy: SendMailSessionSpy
  mailFilePath: string
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  getAccountByEmailRepositorySpy.account = mockAccountModel()
  const sendMailSessionSpy = new SendMailSessionSpy()
  const mailFilePath = faker.internet.url()
  const sut = new DbRequestRecoverPassword(getAccountByEmailRepositorySpy, sendMailSessionSpy, mailFilePath)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    sendMailSessionSpy,
    mailFilePath
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
    const promise = sut.request({ email: faker.internet.email() })
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailSession with correct values', async () => {
    const { sut, getAccountByEmailRepositorySpy, sendMailSessionSpy, mailFilePath } = makeSut()
    await sut.request({ email: faker.internet.email() })
    expect(sendMailSessionSpy.sendMailParams).toEqual({
      accountId: getAccountByEmailRepositorySpy.account.id,
      name: getAccountByEmailRepositorySpy.account.name,
      email: getAccountByEmailRepositorySpy.account.email,
      subject: `[Identity] - ${getAccountByEmailRepositorySpy.account.name}, recupere sua senha agora`,
      mailFilePath,
      sessionType: SessionType.recoverPassword
    })
  })

  test('Should return throw if SendMailSession throws', async () => {
    const { sut, sendMailSessionSpy } = makeSut()
    jest.spyOn(sendMailSessionSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.request({ email: faker.internet.email() })
    await expect(promise).rejects.toThrow()
  })
})
