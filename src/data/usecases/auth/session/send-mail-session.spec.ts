import { CreateSessionRepositorySpy, mockSendMailSessionDTO, SendMailSpy, SendToQueueSpy, ConsumeQueueSpy, throwError } from '@/data/test'
import { SessionType } from '@/domain/models/auth'
import { DbSendMailSession } from './send-mail-session'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMailSession
  createSessionRepositorySpy: CreateSessionRepositorySpy
  queueName: string
  sendToQueueSpy: SendToQueueSpy
  consumeQueueSpy: ConsumeQueueSpy
  sendMailSpy: SendMailSpy
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const queueName = faker.database.column()
  const sendToQueueSpy = new SendToQueueSpy()
  const consumeQueueSpy = new ConsumeQueueSpy()
  const sendMailSpy = new SendMailSpy()
  const sut = new DbSendMailSession(createSessionRepositorySpy, queueName, sendToQueueSpy, consumeQueueSpy, sendMailSpy)
  return {
    sut,
    createSessionRepositorySpy,
    queueName,
    sendToQueueSpy,
    consumeQueueSpy,
    sendMailSpy
  }
}

describe('DbSendMailSession', () => {
  test('Should call CreateSessionRepository with correct value', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    const sendMailAccountDTO = mockSendMailSessionDTO(SessionType.activeAccount)
    await sut.sendMail(sendMailAccountDTO)
    expect(createSessionRepositorySpy.params.account_id).toBe(sendMailAccountDTO.accountId)
    expect(createSessionRepositorySpy.params.type).toBe(sendMailAccountDTO.sessionType)
  })

  test('Should throw if CreateSessionRepository throws', async () => {
    const { sut, createSessionRepositorySpy } = makeSut()
    jest.spyOn(createSessionRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailSessionDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendToQueue with correct value', async () => {
    const { sut, sendToQueueSpy, queueName, createSessionRepositorySpy } = makeSut()
    const request = mockSendMailSessionDTO(SessionType.activeAccount)
    const variables = {
      link: createSessionRepositorySpy.session.id,
      name: request.name
    }
    await sut.sendMail(request)
    expect(sendToQueueSpy.queueName).toBe(queueName)
    expect(sendToQueueSpy.params).toEqual({
      subject: request.subject,
      templateFileName: request.mailFilePath,
      to: {
        name: request.name,
        email: request.email
      },
      variables
    })
  })

  test('Should throw if SendToQueue throws', async () => {
    const { sut, sendToQueueSpy } = makeSut()
    jest.spyOn(sendToQueueSpy, 'sendToQueue').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailSessionDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })

  test('Should call ConsumeQueue with correct value', async () => {
    const { sut, consumeQueueSpy, queueName } = makeSut()
    await sut.sendMail(mockSendMailSessionDTO(SessionType.activeAccount))
    expect(consumeQueueSpy.queueName).toBe(queueName)
  })
})
