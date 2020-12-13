import { SendMail, SendMailDTO } from '@/domain/usecases/utils'
import { SendToQueue } from '@/data/protocols/message-queue'

export class DbSendMail implements SendMail {
  constructor (
    private readonly queueName: string,
    private readonly sendToQueue: SendToQueue
  ) {}

  async sendMail (data: SendMailDTO): Promise<void> {
    this.sendToQueue.sendToQueue(this.queueName, data.variables)
  }
}
