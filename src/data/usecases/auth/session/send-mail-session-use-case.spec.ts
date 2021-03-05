import { DbSendMailSessionUseCase } from './send-mail-session-use-case'
import { CreateSessionRepositorySpy, mockSendMailSessionDTO, SendToQueueSpy, ConsumeQueueStub, ExecuteQueueSpy, throwError } from '@/data/tests'
import { SessionType } from '@/domain/models/auth'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMailSessionUseCase
  createSessionRepositorySpy: CreateSessionRepositorySpy
  queueName: string
  sendToQueueSpy: SendToQueueSpy
  consumeQueueStub: ConsumeQueueStub
  executeQueueSpy: ExecuteQueueSpy
}

const makeSut = (): sutTypes => {
  const createSessionRepositorySpy = new CreateSessionRepositorySpy()
  const queueName = faker.database.column()
  const sendToQueueSpy = new SendToQueueSpy()
  const consumeQueueStub = new ConsumeQueueStub()
  const executeQueueSpy = new ExecuteQueueSpy()
  const sut = new DbSendMailSessionUseCase(createSessionRepositorySpy, queueName, sendToQueueSpy, consumeQueueStub, executeQueueSpy)
  return {
    sut,
    createSessionRepositorySpy,
    queueName,
    sendToQueueSpy,
    consumeQueueStub,
    executeQueueSpy
  }
}

describe('DbSendMailSessionUseCase', () => {
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
    expect(sendToQueueSpy.params).toEqual({
      queueName,
      params: {
        sender: {
          name: 'Identity',
          email: 'identity@identity.com.br'
        },
        subject: request.subject,
        templateFileName: request.mailFilePath,
        to: {
          name: request.name,
          email: request.email
        },
        variables
      }
    })
  })

  test('Should throw if SendToQueue throws', async () => {
    const { sut, sendToQueueSpy } = makeSut()
    jest.spyOn(sendToQueueSpy, 'sendToQueue').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailSessionDTO(SessionType.activeAccount))
    await expect(promise).rejects.toThrow()
  })

  test('Should call ConsumeQueue with correct value', async () => {
    const { sut, consumeQueueStub, queueName, executeQueueSpy } = makeSut()
    await sut.sendMail(mockSendMailSessionDTO(SessionType.activeAccount))
    expect(consumeQueueStub.params).toEqual({
      queueName,
      executor: executeQueueSpy
    })
  })
})
