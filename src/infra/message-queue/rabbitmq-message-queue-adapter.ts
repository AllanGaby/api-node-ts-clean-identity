import { SendToQueue, ConsumeQueue, ExecuteQueue, SendToQueueDTO } from '@/data/protocols/message-queue'
import { Channel, connect, ConsumeMessage } from 'amqplib'

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

  async sendToQueue<ParamsType = any>({ queueName, params }: SendToQueueDTO<ParamsType>): Promise<boolean> {
    const channel = await this.getChannel()
    await this.createQueue(channel, queueName)
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(params)))
  }

  async consume (queueName: string, executor: ExecuteQueue): Promise<any> {
    const channel = await this.getChannel()
    await this.createQueue(channel, queueName)
    channel.consume(queueName, (paramsRabbitMQ: ConsumeMessage) => {
      const params = JSON.parse(paramsRabbitMQ.content.toString())
      executor.execute(params)
    }, { noAck: true })
  }
}
