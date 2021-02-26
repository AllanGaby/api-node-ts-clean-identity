import { SendToQueueDTO } from '@/data/protocols/message-queue'
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
}

export class ConnectionRabbitMQSpy {
  async createChannel (): Promise<any> {
    return new ChannelRabbitMQSpy()
  }
}
