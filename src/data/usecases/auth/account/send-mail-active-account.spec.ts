import { CreateSessionRepositorySpy, mockSendMailActiveAccountDTO, throwError, MailTemplateAdapterSpy, mockSessionModel } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { DbSendMailActiveAccount } from './send-mail-active-account'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMailActiveAccount
  createSessionRepositorySpy: CreateSessionRepositorySpy
  mailTemplateAdapterSpy: MailTemplateAdapterSpy
  mailFilePath: string
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const mailFilePath = faker.internet.url()
  const sut = new DbSendMailActiveAccount(createSessionRepositorySpy, mailTemplateAdapterSpy, mailFilePath)
  return {
    sut,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy,
    mailFilePath
  }
}

describe('DbSendMailActiveAccount', () => {
  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    const sendMailActiveAccountDTO = mockSendMailActiveAccountDTO()
    await sut.sendMail(sendMailActiveAccountDTO)
    expect(createSessionRepositorySpy.addSessionParams.accountId).toBe(sendMailActiveAccountDTO.accountId)
    expect(createSessionRepositorySpy.addSessionParams.type).toBe(SessionType.activeAccount)
  })

  test('Should throw if CreateSessionRepository throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call MailTemplateAdapter with correct values', async () => {
    const { sut, createSessionRepositorySpy, mailTemplateAdapterSpy, mailFilePath } = makeSut()
    createSessionRepositorySpy.session = mockSessionModel()
    const sendMailActiveAccountDTO = mockSendMailActiveAccountDTO()
    await sut.sendMail(sendMailActiveAccountDTO)
    const variables = {
      sessionId: createSessionRepositorySpy.session.id,
      name: sendMailActiveAccountDTO.name
    }
    expect(mailTemplateAdapterSpy.parseParams).toEqual({
      filePath: mailFilePath,
      variables
    })
  })
})
