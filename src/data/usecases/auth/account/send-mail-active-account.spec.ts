import { CreateSessionRepositorySpy, mockSendMailActiveAccountDTO, throwError, MailTemplateAdapterSpy, mockSessionModel, SendMailAdapterSpy } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { DbSendMailActiveAccount } from './send-mail-active-account'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMailActiveAccount
  createSessionRepositorySpy: CreateSessionRepositorySpy
  mailTemplateAdapterSpy: MailTemplateAdapterSpy
  sendMailAdapterSpy: SendMailAdapterSpy
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const sendMailAdapterSpy = new SendMailAdapterSpy()
  const sut = new DbSendMailActiveAccount(createSessionRepositorySpy, mailTemplateAdapterSpy, sendMailAdapterSpy)
  return {
    sut,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy,
    sendMailAdapterSpy
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
    const { sut, createSessionRepositorySpy, mailTemplateAdapterSpy } = makeSut()
    createSessionRepositorySpy.session = mockSessionModel()
    const sendMailActiveAccountDTO = mockSendMailActiveAccountDTO()
    await sut.sendMail(sendMailActiveAccountDTO)
    const variables = {
      sessionId: createSessionRepositorySpy.session.id,
      name: sendMailActiveAccountDTO.name
    }
    expect(mailTemplateAdapterSpy.parseParams).toEqual({
      filePath: sendMailActiveAccountDTO.mailFilePath,
      variables
    })
  })

  test('Should return throw if MailTemplateAdapter throws', async () => {
    const { sut, mailTemplateAdapterSpy } = makeSut()
    jest.spyOn(mailTemplateAdapterSpy, 'parse').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailAdapter with correct values', async () => {
    const { sut, mailTemplateAdapterSpy, sendMailAdapterSpy } = makeSut()
    mailTemplateAdapterSpy.mailParsed = faker.random.words()
    const sendMailActiveAccountDTO = mockSendMailActiveAccountDTO()
    await sut.sendMail(sendMailActiveAccountDTO)
    expect(sendMailAdapterSpy.sendMailParams).toEqual({
      to: {
        name: sendMailActiveAccountDTO.name,
        email: sendMailActiveAccountDTO.email
      },
      subject: sendMailActiveAccountDTO.subject,
      content: mailTemplateAdapterSpy.mailParsed
    })
  })

  test('Should return throw if SendMailAdapter throws', async () => {
    const { sut, sendMailAdapterSpy } = makeSut()
    jest.spyOn(sendMailAdapterSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailActiveAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})