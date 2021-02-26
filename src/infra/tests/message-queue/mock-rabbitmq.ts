import { ExecuteQueue, SendToQueueDTO, ConsumeQueueDTO } from '@/data/protocols/message-queue'
import { ConsumeMessage } from 'amqplib'
import faker from 'faker'

export const mockSendToQueueDTO = (): SendToQueueDTO<object> => ({
  queueName: faker.random.uuid(),
  params: faker.random.objectElement<any>({
    [faker.database.column()]: faker.random.uuid()
  })
})

export class ChannelRabbitMQSpy {
  async assertQueue (queueName: string, options: any): Promise<any> {

  }

  async sendToQueue (queueName: string, params: any): Promise<any> {

  }

  async consume (queue: string, onMessage: (msg: ConsumeMessage | null) => void): Promise<any> {

  }
}

export class ConnectionRabbitMQSpy {
  constructor (private readonly channel: ChannelRabbitMQSpy) {}

  async createChannel (): Promise<any> {
    return this.channel
  }
}

export class ExecuteQueueSpy implements ExecuteQueue {
  async execute (params: any): Promise<void> {

  }
}

export const mockConsumeQueueDTO = (): ConsumeQueueDTO => {
  const queueName = faker.random.uuid()
  const executor = new ExecuteQueueSpy()
  return {
    queueName,
    executor
  }
}

export const mockConsumeMessage = (): ConsumeMessage => ({
  content: Buffer.from(JSON.stringify({
    id: faker.random.uuid()
  })),
  fields: undefined,
  properties: undefined
})
