import { DbCreateAccountUseCase } from './create-account-use-case'
import { GetAccountByEmailRepositorySpy, CreateAccountRepositorySpy, mockCreateAccountDTO, mockAccountModel, HashCreatorSpy, throwError, SendMailSessionSpy } from '@/data/test'
import faker from 'faker'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbCreateAccountUseCase
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hashCreatorSpy: HashCreatorSpy
  createAccountRepositorySpy: CreateAccountRepositorySpy
  sendMailSessionSpy: SendMailSessionSpy
  mailFilePath: string
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const hashCreatorSpy = new HashCreatorSpy()
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  const sendMailSessionSpy = new SendMailSessionSpy()
  const mailFilePath = faker.internet.url()
  const sut =
    new DbCreateAccountUseCase(
      getAccountByEmailRepositorySpy,
      hashCreatorSpy,
      createAccountRepositorySpy,
      sendMailSessionSpy,
      mailFilePath)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hashCreatorSpy,
    createAccountRepositorySpy,
    sendMailSessionSpy,
    mailFilePath
  }
}

describe('DbCreateAccountUseCase', () => {
  test('Should call GetAccountByEmailRepository with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const createAccountParams = mockCreateAccountDTO()
    await sut.create(createAccountParams)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(createAccountParams.email)
  })

  test('Should return throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByEmailRepository return an Account', async () => {
    const { sut, getAccountByEmailRepositorySpy, hashCreatorSpy } = makeSut()
    const createHashSpy = jest.spyOn(hashCreatorSpy, 'createHash')
    getAccountByEmailRepositorySpy.account = mockAccountModel()
    const promise = sut.create(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call HashCreator with correct value', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    const addAccountParams = mockCreateAccountDTO()
    await sut.create(addAccountParams)
    expect(hashCreatorSpy.payload).toBe(addAccountParams.password)
  })

  test('Should return throw if HashCreator throws', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    jest.spyOn(hashCreatorSpy, 'createHash').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateAccountRepository with correct value', async () => {
    const { sut, createAccountRepositorySpy, hashCreatorSpy } = makeSut()
    const createAccountParams = mockCreateAccountDTO()
    await sut.create(createAccountParams)
    expect(createAccountRepositorySpy.addAccountParams).toEqual({
      name: createAccountParams.name,
      email: createAccountParams.email,
      password: hashCreatorSpy.hash
    })
  })

  test('Should return throw if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositorySpy } = makeSut()
    jest.spyOn(createAccountRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailSession with correct values', async () => {
    const { sut, createAccountRepositorySpy, sendMailSessionSpy, mailFilePath } = makeSut()
    await sut.create(mockCreateAccountDTO())
    expect(sendMailSessionSpy.sendMailParams).toEqual({
      accountId: createAccountRepositorySpy.account.id,
      name: createAccountRepositorySpy.account.name,
      email: createAccountRepositorySpy.account.email,
      subject: `[Identity] - ${createAccountRepositorySpy.account.name}, sua conta foi criada com sucesso`,
      mailFilePath,
      sessionType: SessionType.activeAccount
    })
  })

  test('Should return throw if SendMailSession throws', async () => {
    const { sut, sendMailSessionSpy } = makeSut()
    jest.spyOn(sendMailSessionSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
