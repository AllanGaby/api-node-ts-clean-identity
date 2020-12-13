import { SendMailSession, SendMailSessionDTO } from '@/domain/usecases/auth/session'
import { SendMail } from '@/domain/usecases/utils'
import { SessionModel } from '@/domain/models/auth'
import { CreateSessionRepository } from '@/data/repositories/auth/session'

export class DbSendMailSession implements SendMailSession {
  constructor (
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly sendMailUseCase: SendMail
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
    this.sendMailUseCase.sendMail({
      subject,
      templateFileName: mailFilePath,
      to: {
        name,
        email
      },
      variables
    })
    return session
  }
}
