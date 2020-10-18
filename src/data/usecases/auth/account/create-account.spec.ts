import { DbCreateAccount } from './create-account'
import {
  GetAccountByEmailRepositorySpy,
  CreateAccountRepositorySpy,
  makeAddAccountDTO,
  mockAccountModel,
  HasherSpy,
  CreateSessionRepositorySpy,
  MailTemplateAdapterSpy,
  SendMailAdapterSpy,
  throwError
} from '@/data/test'
import faker from 'faker'
import { mockSessionModel } from '@/data/test/auth/mock-session'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbCreateAccount
  getAccountByEmailRepositorySpy: GetAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
  createAccountRepositorySpy: CreateAccountRepositorySpy
  createSessionRepositorySpy: CreateSessionRepositorySpy
  mailTemplateAdapterSpy: MailTemplateAdapterSpy
  mailFilePath: string
  sendMailAdapterSpy: SendMailAdapterSpy
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const mailFilePath = faker.internet.url()
  const sendMailAdapterSpy = new SendMailAdapterSpy()
  const sut =
    new DbCreateAccount(
      getAccountByEmailRepositorySpy,
      hasherSpy,
      createAccountRepositorySpy,
      createSessionRepositorySpy,
      mailTemplateAdapterSpy,
      mailFilePath,
      sendMailAdapterSpy)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hasherSpy,
    createAccountRepositorySpy,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy,
    mailFilePath,
    sendMailAdapterSpy
  }
}

describe('DbCreateAccount', () => {
  test('Should call GetAccountByEmailRepository with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(addAccountParams.email)
  })

  test('Should return throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(getAccountByEmailRepositorySpy, 'getAccountByEmail').mockImplementationOnce(throwError)
    const promise = sut.add(makeAddAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetAccountByEmailRepository return an Account', async () => {
    const { sut, getAccountByEmailRepositorySpy, hasherSpy } = makeSut()
    const createHashSpy = jest.spyOn(hasherSpy, 'createHash')
    getAccountByEmailRepositorySpy.account = mockAccountModel()
    const session = await sut.add(makeAddAccountDTO())
    expect(session).toBeFalsy()
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call Hasher with correct value', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(hasherSpy.payload).toBe(addAccountParams.password)
  })

  test('Should return throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'createHash').mockImplementationOnce(throwError)
    const promise = sut.add(makeAddAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositorySpy, hasherSpy } = makeSut()
    hasherSpy.hash = faker.random.uuid()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(createAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.hash
    })
  })

  test('Should return throw if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositorySpy } = makeSut()
    jest.spyOn(createAccountRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(makeAddAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return throw if createSessionRepositorySpy throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(makeAddAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call MailTemplateAdapter with correct values', async () => {
    const { sut, createSessionRepositorySpy, mailTemplateAdapterSpy, mailFilePath } = makeSut()
    createSessionRepositorySpy.session = mockSessionModel(SessionType.activeAccount)
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    const variables = {
      sessionId: createSessionRepositorySpy.session.id,
      name: addAccountParams.name
    }
    expect(mailTemplateAdapterSpy.parseParams).toEqual({
      filePath: mailFilePath,
      variables
    })
  })

  test('Should return throw if MailTemplateAdapter throws', async () => {
    const { sut, mailTemplateAdapterSpy } = makeSut()
    jest.spyOn(mailTemplateAdapterSpy, 'parse').mockImplementationOnce(throwError)
    const promise = sut.add(makeAddAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailAdapter with correct values', async () => {
    const { sut, mailTemplateAdapterSpy, sendMailAdapterSpy } = makeSut()
    mailTemplateAdapterSpy.mailParsed = faker.random.words()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(sendMailAdapterSpy.sendMailParams).toEqual({
      to: {
        name: addAccountParams.name,
        email: addAccountParams.email
      },
      subject: `[Identity] - ${addAccountParams.name}, sua conta foi criada com sucesso`,
      content: mailTemplateAdapterSpy.mailParsed
    })
  })

  test('Should return throw if SendMailAdapter throws', async () => {
    const { sut, sendMailAdapterSpy } = makeSut()
    jest.spyOn(sendMailAdapterSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.add(makeAddAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
