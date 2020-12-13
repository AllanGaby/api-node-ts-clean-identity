import { DbSendMail } from './send-mail'
import { SendToQueueSpy, mockSendMailDTO, throwError } from '@/data/test'
import faker from 'faker'

interface sutTypes {
  sut: DbSendMail
  queueName: string
  sendToQueueSpy: SendToQueueSpy
}

const makeSut = (): sutTypes => {
  const queueName = faker.database.column()
  const sendToQueueSpy = new SendToQueueSpy()
  const sut = new DbSendMail(queueName, sendToQueueSpy)
  return {
    sut,
    queueName,
    sendToQueueSpy
  }
}

describe('DbSendMail', () => {
  test('Should call SendToQueue with correct params', async () => {
    const { sut, queueName, sendToQueueSpy } = makeSut()
    const request = mockSendMailDTO()
    await sut.sendMail(request)
    expect(sendToQueueSpy.queueName).toEqual(queueName)
    expect(sendToQueueSpy.params).toEqual(request.variables)
  })

  test('Should throw if SendToQueue throws', async () => {
    const { sut, sendToQueueSpy } = makeSut()
    jest.spyOn(sendToQueueSpy, 'sendToQueue').mockImplementationOnce(throwError)
    const promise = sut.sendMail(mockSendMailDTO())
    await expect(promise).rejects.toThrow()
  })
})
