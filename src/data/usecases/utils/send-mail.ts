import { SendMail, SendMailDTO, SendMailVariables } from '@/domain/usecases/utils'
import { SendToQueue, ConsumeQueue } from '@/data/protocols/message-queue'

export class DbSendMail implements SendMail {
  constructor (
    private readonly queueName: string,
    private readonly sendToQueue: SendToQueue,
    private readonly consumeQueue: ConsumeQueue
  ) {}

  async sendMail (data: SendMailDTO): Promise<void> {
    this.sendToQueue.sendToQueue<SendMailVariables>(this.queueName, data.variables)
    this.consumeQueue.consume<SendMailVariables>(this.queueName, (data: SendMailVariables) => {})
  }
}
