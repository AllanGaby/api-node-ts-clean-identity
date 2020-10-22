import { CreateSessionRepositorySpy, mockSendMailAccountDTO, throwError, MailTemplateAdapterSpy, mockSessionModel, SendMailAdapterSpy } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { DbSendMailSession } from './send-mail-session'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMailSession
  createSessionRepositorySpy: CreateSessionRepositorySpy
  mailTemplateAdapterSpy: MailTemplateAdapterSpy
  sendMailAdapterSpy: SendMailAdapterSpy
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const mailTemplateAdapterSpy = new MailTemplateAdapterSpy()
  const sendMailAdapterSpy = new SendMailAdapterSpy()
  const sut = new DbSendMailSession(createSessionRepositorySpy, mailTemplateAdapterSpy, sendMailAdapterSpy)
  return {
    sut,
    createSessionRepositorySpy,
    mailTemplateAdapterSpy,
    sendMailAdapterSpy
  }
}

describe('DbSendMailSession', () => {
  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    const sendMailAccountDTO = mockSendMailAccountDTO(SessionType.activeAccount)
    await sut.sendMail(sendMailAccountDTO)
    expect(createSessionRepositorySpy.addSessionParams.accountId).toBe(sendMailAccountDTO.accountId)
    expect(createSessionRepositorySpy.addSessionParams.type).toBe(sendMailAccountDTO.sessionType)
  })

  test('Should throw if CreateSessionRepository throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailAccountDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })

  test('Should call MailTemplateAdapter with correct values', async () => {
    const { sut, createSessionRepositorySpy, mailTemplateAdapterSpy } = makeSut()
    createSessionRepositorySpy.session = mockSessionModel()
    const sendMailAccountDTO = mockSendMailAccountDTO(SessionType.activeAccount)
    await sut.sendMail(sendMailAccountDTO)
    const variables = {
      sessionId: createSessionRepositorySpy.session.id,
      name: sendMailAccountDTO.name
    }
    expect(mailTemplateAdapterSpy.parseParams).toEqual({
      filePath: sendMailAccountDTO.mailFilePath,
      variables
    })
  })

  test('Should return throw if MailTemplateAdapter throws', async () => {
    const { sut, mailTemplateAdapterSpy } = makeSut()
    jest.spyOn(mailTemplateAdapterSpy, 'parse').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailAccountDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailAdapter with correct values', async () => {
    const { sut, mailTemplateAdapterSpy, sendMailAdapterSpy } = makeSut()
    mailTemplateAdapterSpy.mailParsed = faker.random.words()
    const sendMailAccountDTO = mockSendMailAccountDTO(SessionType.activeAccount)
    await sut.sendMail(sendMailAccountDTO)
    expect(sendMailAdapterSpy.sendMailParams).toEqual({
      to: {
        name: sendMailAccountDTO.name,
        email: sendMailAccountDTO.email
      },
      subject: sendMailAccountDTO.subject,
      content: mailTemplateAdapterSpy.mailParsed
    })
  })

  test('Should return throw if SendMailAdapter throws', async () => {
    const { sut, sendMailAdapterSpy } = makeSut()
    jest.spyOn(sendMailAdapterSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailAccountDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })
})
