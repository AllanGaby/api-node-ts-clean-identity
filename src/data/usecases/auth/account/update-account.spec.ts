import { DbUpdateAccount } from './update-account'
import { GetAccountByIdRepositorySpy, UpdateAccountRepositorySpy } from '@/data/test/auth/mock-account-repository'
import { CreateSessionRepositorySpy } from '@/data/test/auth/mock-session-repository'
import { mockSessionModel, mockUpdateAccountDTO, throwError } from '@/data/test'
import { HasherSpy } from '@/data/test/mock-criptography'
import { MailTemplateAdapterSpy, SendMailAdapterSpy } from '@/data/test/mock-comunication'
import faker from 'faker'
import { SessionType } from '@/domain/models/auth'

interface sutTypes {
  sut: DbUpdateAccount
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  hasherSpy: HasherSpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
  createSessionRepositorySpy: CreateSessionRepositorySpy
  mailTemplateAdapterSpy: MailTemplateAdapterSpy
  mailFilePath: string
  sendMailAdapterSpy: SendMailAdapterSpy
}

const makeSut = (): sutTypes => {
  const hasherSpy = new HasherSpy()
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const mailFilePath = faker.internet.url()
  const sendMailAdapterSpy = new SendMailAdapterSpy()
  const sut = new DbUpdateAccount(
    getAccountByIdRepositorySpy,
    hasherSpy,
    updateAccountRepositorySpy,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy,
    mailFilePath,
    sendMailAdapterSpy)
  return {
    sut,
    getAccountByIdRepositorySpy,
    hasherSpy,
    updateAccountRepositorySpy,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy,
    mailFilePath,
    sendMailAdapterSpy
  }
}

describe('DbUpdateAccount', () => {
  test('Should call GetAccountByIdRepostirory with correct values', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(getAccountByIdRepositorySpy.accountId).toBe(updateAccountDTO.id)
  })

  test('Should return null if GetAccountByIdRepostirory return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.update(mockUpdateAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should throw if GetAccountByIdRepostirory throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call Hasher if not change password', async () => {
    const { sut, hasherSpy } = makeSut()
    const createHashSpy = jest.spyOn(hasherSpy, 'createHash')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.password
    await sut.update(updateAccountDTO)
    expect(createHashSpy).not.toBeCalled()
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'createHash').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call Hasher with correct values if change password', async () => {
    const { sut, hasherSpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(hasherSpy.payload).toBe(updateAccountDTO.password)
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, hasherSpy, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(updateAccountRepositorySpy.account.id).toBe(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.account.name).toBe(updateAccountDTO.name)
    expect(updateAccountRepositorySpy.account.email).toBe(updateAccountDTO.email)
    expect(updateAccountRepositorySpy.account.password).toBe(hasherSpy.hash)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateSessionRepositorySpy with correct values', async () => {
    const { sut, getAccountByIdRepositorySpy, createSessionRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(createSessionRepositorySpy.addSessionParams.accountId).toBe(getAccountByIdRepositorySpy.account.id)
    expect(createSessionRepositorySpy.addSessionParams.type).toBe(SessionType.activeAccount)
  })

  test('Should throw if CreateSessionRepositorySpy throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call MailTemplateAdapter with correct values', async () => {
    const { sut, createSessionRepositorySpy, mailTemplateAdapterSpy, mailFilePath } = makeSut()
    createSessionRepositorySpy.session = mockSessionModel()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    const variables = {
      sessionId: createSessionRepositorySpy.session.id,
      name: updateAccountDTO.name
    }
    expect(mailTemplateAdapterSpy.parseParams).toEqual({
      filePath: mailFilePath,
      variables
    })
  })

  test('Should throw if MailTemplateAdapter throws', async () => {
    const { sut, mailTemplateAdapterSpy } = makeSut()
    jest.spyOn(mailTemplateAdapterSpy, 'parse').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailAdapter with correct values', async () => {
    const { sut, mailTemplateAdapterSpy, sendMailAdapterSpy } = makeSut()
    mailTemplateAdapterSpy.mailParsed = faker.random.words()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(sendMailAdapterSpy.sendMailParams).toEqual({
      to: {
        name: updateAccountDTO.name,
        email: updateAccountDTO.email
      },
      subject: `[Identity] - ${updateAccountDTO.name}, sua conta foi alterada com sucesso`,
      content: mailTemplateAdapterSpy.mailParsed
    })
  })
})
