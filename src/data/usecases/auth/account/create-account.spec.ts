import { DbCreateAccount } from './create-account'
import {
  GetAccountByEmailRepositorySpy,
  CreateAccountRepositorySpy,
  makeAddAccountDTO,
  mockAccountModel,
  HasherSpy,
  CreateSessionRepositorySpy,
  MailTemplateAdapterSpy
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
}

const makeSut = (): sutTypes => {
  const getAccountByEmailRepositorySpy = new GetAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const sut =
    new DbCreateAccount(
      getAccountByEmailRepositorySpy,
      hasherSpy,
      createAccountRepositorySpy,
      createSessionRepositorySpy,
      mailTemplateAdapterSpy)
  return {
    sut,
    getAccountByEmailRepositorySpy,
    hasherSpy,
    createAccountRepositorySpy,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy
  }
}

describe('DbCreateAccount', () => {
  test('Should call GetAccountByEmail with correct value', async () => {
    const { sut, getAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(getAccountByEmailRepositorySpy.searchMail).toBe(addAccountParams.email)
  })

  test('Should return null if GetAccountByEmailRepository return an Account', async () => {
    const { sut, getAccountByEmailRepositorySpy, hasherSpy } = makeSut()
    const createHashSpy = jest.spyOn(hasherSpy, 'createHash')
    getAccountByEmailRepositorySpy.account = mockAccountModel()
    const account = await sut.add(makeAddAccountDTO())
    expect(account).toBeFalsy()
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should call Hasher with correct value', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(hasherSpy.payload).toBe(addAccountParams.password)
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

  test('Should call MailTemplateAdapter with correct values', async () => {
    const { sut, createSessionRepositorySpy, mailTemplateAdapterSpy } = makeSut()
    createSessionRepositorySpy.session = mockSessionModel(SessionType.activeAccount)
    const addAccountParams = makeAddAccountDTO()
    await sut.add(addAccountParams)
    expect(mailTemplateAdapterSpy.variables).toEqual({
      sessionId: createSessionRepositorySpy.session.id,
      name: addAccountParams.name
    })
  })
})
