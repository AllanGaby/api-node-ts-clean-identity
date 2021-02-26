import { SendMailSessionUseCase, SendMailSessionDTO } from '@/domain/usecases/auth/session'
import { SessionModel } from '@/domain/models/auth'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { ConsumeQueue, SendToQueue, ExecuteQueue } from '@/data/protocols/message-queue'
import { SendMailDTO } from '@/domain/usecases/utils'

export class DbSendMailSessionUseCase implements SendMailSessionUseCase {
  constructor (
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly queueName: string,
    private readonly sendToQueue: SendToQueue,
    private readonly consumeQueue: ConsumeQueue,
    private readonly sendMailByMessageQueue: ExecuteQueue
  ) {}

  async sendMail ({ accountId, email, name, subject, mailFilePath, sessionType }: SendMailSessionDTO): Promise<SessionModel> {
    const session = await this.createSessionRepository.create({
      account_id: accountId,
      type: sessionType,
      experied_at: new Date(new Date().setDate(new Date().getDate() + 1))
    })
    const variables = {
      link: session.id,
      name
    }
    this.sendToQueue.sendToQueue<SendMailDTO>({
      queueName: this.queueName,
      params: {
        subject,
        templateFileName: mailFilePath,
        to: {
          name,
          email
        },
        variables
      }
    })
    this.consumeQueue.consume({
      queueName: this.queueName,
      executor: this.sendMailByMessageQueue
    })
    return session
  }
}
