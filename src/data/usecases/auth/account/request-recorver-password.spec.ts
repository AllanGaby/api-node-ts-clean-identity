import { GetAccountByEmailRepositorySpy, throwError, mockAccountModel, SendMailAccountSpy } from '@/data/test'
import { DbRequestRecoverPassword } from './request-recover-password'
import faker from 'faker'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbRequestRecoverPassword
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  sendMailAccountSpy: SendMailAccountSpy
  mailFilePath: string
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  getAccountByEmailRepositorySpy.account = mockAccountModel()
  const sendMailAccountSpy = new SendMailAccountSpy()
  const mailFilePath = faker.internet.url()
  const sut = new DbRequestRecoverPassword(getAccountByEmailRepositorySpy, sendMailAccountSpy, mailFilePath)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    sendMailAccountSpy,
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
    const email = faker.internet.email()
    const sendMail = await sut.request({ email })
    expect(sendMail).toBeFalsy()
  })

  test('Should call SendMailAccount with correct values', async () => {
    const { sut, getAccountByEmailRepositorySpy, sendMailAccountSpy, mailFilePath } = makeSut()
    await sut.request({ email: faker.internet.email() })
    expect(sendMailAccountSpy.sendMailParams).toEqual({
      accountId: getAccountByEmailRepositorySpy.account.id,
      name: getAccountByEmailRepositorySpy.account.name,
      email: getAccountByEmailRepositorySpy.account.email,
      subject: `[Identity] - ${getAccountByEmailRepositorySpy.account.name}, recupere sua senha agora`,
      mailFilePath,
      sessionType: SessionType.recoverPassword
    })
  })

  test('Should return throw if SendMailAccount throws', async () => {
    const { sut, sendMailAccountSpy } = makeSut()
    jest.spyOn(sendMailAccountSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.request({ email: faker.internet.email() })
    await expect(promise).rejects.toThrow()
  })
})
