import { DbCreateAccount } from './create-account'
import {
  GetAccountByEmailRepositorySpy,
  CreateAccountRepositorySpy,
  mockCreateAccountDTO,
  mockAccountModel,
  HashCreatorSpy,
  throwError,
  SendMailActiveAccountSpy
} from '@/data/test'
import faker from 'faker'

interface sutTypes {
  sut: DbCreateAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hashCreatorSpy: HashCreatorSpy
  createAccountRepositorySpy: CreateAccountRepositorySpy
  sendMailActiveAccountSpy: SendMailActiveAccountSpy
  mailFilePath: string
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const hashCreatorSpy = new HashCreatorSpy()
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  const sendMailActiveAccountSpy = new SendMailActiveAccountSpy()
  const mailFilePath = faker.internet.url()
  const sut =
    new DbCreateAccount(
      getAccountByEmailRepositorySpy,
      hashCreatorSpy,
      createAccountRepositorySpy,
      sendMailActiveAccountSpy,
      mailFilePath)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hashCreatorSpy,
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
    const { sut, getAccountByEmailRepositorySpy, hashCreatorSpy } = makeSut()
    const createHashSpy = jest.spyOn(hashCreatorSpy, 'createHash')
    getAccountByEmailRepositorySpy.account = mockAccountModel()
    const session = await sut.add(mockCreateAccountDTO())
    expect(session).toBeFalsy()
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call HashCreator with correct value', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    const addAccountParams = mockCreateAccountDTO()
    await sut.add(addAccountParams)
    expect(hashCreatorSpy.payload).toBe(addAccountParams.password)
  })

  test('Should return throw if HashCreator throws', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    jest.spyOn(hashCreatorSpy, 'createHash').mockImplementationOnce(throwError)
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
