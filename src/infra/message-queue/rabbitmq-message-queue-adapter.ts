import { Channel, connect, ConsumeMessage } from 'amqplib'
import { SendToQueue, ConsumeQueue } from '@/data/protocols/message-queue'

export class RabbitMQMessageQueueAdapter implements SendToQueue, ConsumeQueue {
  constructor (private readonly url: string) {}

  private readonly getChannel = async (): Promise<Channel> => {
    const connection = await connect(this.url)
    return await connection.createChannel()
  }

  private readonly createQueue = async (channel: Channel, queueName: string): Promise<any> => {
    return await new Promise((resolve: any, reject: any) => {
      try {
        channel.assertQueue(queueName, { durable: true })
        resolve(channel)
      } catch (error) {
        reject(error)
      }
    })
  }

  async sendToQueue<ParamsType = any>(queueName: string, params: ParamsType): Promise<boolean> {
    const channel = await this.getChannel()
    await this.createQueue(channel, queueName)
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(params)))
  }

  async consume (queueName: string, callback: (params: ConsumeMessage) => any): Promise<any> {
    const channel = await this.getChannel()
    await this.createQueue(channel, queueName)
    channel.consume(queueName, callback, { noAck: true })
  }
}
