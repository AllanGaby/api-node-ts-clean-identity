import { RabbitMQMessageQueueAdapter } from './rabbitmq-message-queue-adapter'
import { mockSendToQueueDTO, ConnectionRabbitMQSpy, ChannelRabbitMQSpy, ExecuteQueueSpy, mockConsumeQueueDTO } from '@/infra/tests/message-queue'
import amqplib from 'amqplib'
import faker from 'faker'
import { throwError } from '@/data/tests'

const channel = new ChannelRabbitMQSpy()
const connection = new ConnectionRabbitMQSpy(channel)

jest.mock('amqplib', () => ({
  connect: (url: string) => { return connection }
}))

interface sutTypes {
  sut: RabbitMQMessageQueueAdapter
  executeQueueSpy: ExecuteQueueSpy
  url: string
}

const makeSut = (): sutTypes => {
  const url = faker.internet.url()
  const executeQueueSpy = new ExecuteQueueSpy()
  const sut = new RabbitMQMessageQueueAdapter(url)
  return {
    sut,
    url,
    executeQueueSpy
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

    test('Should call createChannel with correct value', async () => {
      const { sut } = makeSut()
      const createChannelSpyon = jest.spyOn(connection, 'createChannel')
      await sut.sendToQueue(mockSendToQueueDTO())
      expect(createChannelSpyon).toHaveBeenCalled()
    })

    test('Should return throw if createChannel throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(connection, 'createChannel').mockImplementationOnce(throwError)
      const promise = sut.sendToQueue(mockSendToQueueDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should call assertQueue with correct values', async () => {
      const { sut } = makeSut()
      const assertQueueSpyon = jest.spyOn(channel, 'assertQueue')
      const request = mockSendToQueueDTO()
      await sut.sendToQueue(request)
      expect(assertQueueSpyon).toHaveBeenCalledWith(request.queueName, {
        durable: true
      })
    })

    test('Should return throw if assertQueue throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(channel, 'assertQueue').mockImplementationOnce(throwError)
      const promise = sut.sendToQueue(mockSendToQueueDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should call sendToQueue with correct values', async () => {
      const { sut } = makeSut()
      const sendToQueueSpyon = jest.spyOn(channel, 'sendToQueue')
      const request = mockSendToQueueDTO()
      await sut.sendToQueue(request)
      expect(sendToQueueSpyon).toHaveBeenCalledWith(request.queueName, Buffer.from(JSON.stringify(request.params)))
    })

    test('Should return throw if sendToQueue throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(channel, 'sendToQueue').mockImplementationOnce(throwError)
      const promise = sut.sendToQueue(mockSendToQueueDTO())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('consume', () => {
    test('Should call connection with correct value', async () => {
      const { sut, url } = makeSut()
      const connectSpyon = jest.spyOn(amqplib, 'connect')
      await sut.consume(mockConsumeQueueDTO())
      expect(connectSpyon).toHaveBeenCalledWith(url)
    })

    test('Should return throw if connection throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(amqplib, 'connect').mockImplementationOnce(throwError)
      const promise = sut.consume(mockConsumeQueueDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should call createChannel with correct value', async () => {
      const { sut } = makeSut()
      const createChannelSpyon = jest.spyOn(connection, 'createChannel')
      await sut.consume(mockConsumeQueueDTO())
      expect(createChannelSpyon).toHaveBeenCalled()
    })

    test('Should return throw if createChannel throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(connection, 'createChannel').mockImplementationOnce(throwError)
      const promise = sut.consume(mockConsumeQueueDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should call assertQueue with correct values', async () => {
      const { sut } = makeSut()
      const assertQueueSpyon = jest.spyOn(channel, 'assertQueue')
      const request = mockConsumeQueueDTO()
      await sut.consume(request)
      expect(assertQueueSpyon).toHaveBeenCalledWith(request.queueName, {
        durable: true
      })
    })

    test('Should return throw if assertQueue throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(channel, 'assertQueue').mockImplementationOnce(throwError)
      const promise = sut.consume(mockConsumeQueueDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should call consume', async () => {
      const { sut } = makeSut()
      const consumeSpyon = jest.spyOn(channel, 'consume')
      const request = mockConsumeQueueDTO()
      await sut.consume(request)
      expect(consumeSpyon).toHaveBeenCalled()
    })

    test('Should return throw if consume throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(channel, 'consume').mockImplementationOnce(throwError)
      const promise = sut.consume(mockConsumeQueueDTO())
      await expect(promise).rejects.toThrow()
    })
  })
})
