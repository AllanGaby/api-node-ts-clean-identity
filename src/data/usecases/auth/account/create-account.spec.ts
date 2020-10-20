import { DbCreateAccount } from './create-account'
import {
  GetAccountByEmailRepositorySpy,
  CreateAccountRepositorySpy,
  mockCreateAccountDTO,
  mockAccountModel,
  HasherSpy,
  throwError,
  SendMailActiveAccountSpy
} from '@/data/test'
import faker from 'faker'

interface sutTypes {
  sut: DbCreateAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
  createAccountRepositorySpy: CreateAccountRepositorySpy
  sendMailActiveAccountSpy: SendMailActiveAccountSpy
  mailFilePath: string
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  const sendMailActiveAccountSpy = new SendMailActiveAccountSpy()
  const mailFilePath = faker.internet.url()
  const sut =
    new DbCreateAccount(
      getAccountByEmailRepositorySpy,
      hasherSpy,
      createAccountRepositorySpy,
      sendMailActiveAccountSpy,
      mailFilePath)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hasherSpy,
    createAccountRepositorySpy,
    sendMailActiveAccountSpy,
    mailFilePath
  }
}

describe('DbCreateAccount', () => {
  test('Should call GetAccountByEmailRepository with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const createAccountParams = mockCreateAccountDTO()
    await sut.add(createAccountParams)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(createAccountParams.email)
  })

  test('Should return throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.add(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByEmailRepository return an Account', async () => {
    const { sut, getAccountByEmailRepositorySpy, hasherSpy } = makeSut()
    const createHashSpy = jest.spyOn(hasherSpy, 'createHash')
    getAccountByEmailRepositorySpy.account = mockAccountModel()
    const session = await sut.add(mockCreateAccountDTO())
    expect(session).toBeFalsy()
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call Hasher with correct value', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockCreateAccountDTO()
    await sut.add(addAccountParams)
    expect(hasherSpy.payload).toBe(addAccountParams.password)
  })

  test('Should return throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'createHash').mockImplementationOnce(throwError)
    const promise = sut.add(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailActiveAccount with correct values', async () => {
    const { sut, createAccountRepositorySpy, sendMailActiveAccountSpy, mailFilePath } = makeSut()
    await sut.add(mockCreateAccountDTO())
    expect(sendMailActiveAccountSpy.sendMailParams).toEqual({
      accountId: createAccountRepositorySpy.account.id,
      name: createAccountRepositorySpy.account.name,
      email: createAccountRepositorySpy.account.email,
      subject: `[Identity] - ${createAccountRepositorySpy.account.name}, sua conta foi criada com sucesso`,
      mailFilePath
    })
  })

  test('Should return throw if SendMailActiveAccount throws', async () => {
    const { sut, sendMailActiveAccountSpy } = makeSut()
    jest.spyOn(sendMailActiveAccountSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.add(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
