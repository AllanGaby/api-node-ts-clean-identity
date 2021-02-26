import { RabbitMQMessageQueueAdapter } from './rabbitmq-message-queue-adapter'
import { mockSendToQueueDTO, ConnectionRabbitMQSpy } from '@/infra/tests/message-queue'
import amqplib from 'amqplib'
import faker from 'faker'
import { throwError } from '@/data/tests'

jest.mock('amqplib', () => ({
  connect: (url: string) => { return new ConnectionRabbitMQSpy() }
}))

interface sutTypes {
  sut: RabbitMQMessageQueueAdapter
  url: string
}

const makeSut = (): sutTypes => {
  const url = faker.internet.url()
  const sut = new RabbitMQMessageQueueAdapter(url)
  return {
    sut,
    url
  }
}

describe('RabbitMQMessageQueueAdapter', () => {
  describe('sendToQueue', () => {
    test('Should call connection with correct value', async () => {
      const { sut, url } = makeSut()
      const connectSpyon = jest.spyOn(amqplib, 'connect')
      await sut.sendToQueue(mockSendToQueueDTO())
      expect(connectSpyon).toHaveBeenCalledWith(url)
    })

    test('Should return throw if connection throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(amqplib, 'connect').mockImplementationOnce(throwError)
      const promise = sut.sendToQueue(mockSendToQueueDTO())
      await expect(promise).rejects.toThrow()
    })
  })
})
