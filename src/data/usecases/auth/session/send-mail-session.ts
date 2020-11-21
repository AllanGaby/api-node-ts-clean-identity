import { SendMailSession, SendMailSessionDTO } from '@/domain/usecases/auth/session'
import { SessionModel } from '@/domain/models/auth'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { MailTemplateAdapter, SendMailAdapter } from '@/data/protocols/comunication/mail'

export class DbSendMailSession implements SendMailSession {
  constructor (
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly mailTemplateAdapter: MailTemplateAdapter,
    private readonly sendMailAdapter: SendMailAdapter
  ) {}

  async sendMail ({ accountId, email, name, subject, mailFilePath, sessionType }: SendMailSessionDTO): Promise<SessionModel> {
    const session = await this.createSessionRepository.create({
      account_id: accountId,
      type: sessionType,
      experied_at: new Date(new Date().getDate() + 1)
    })
    const variables = {
      link: session.id,
      name
    }
    const mailContent = await this.mailTemplateAdapter.parse({
      filePath: mailFilePath,
      variables
    })
    await this.sendMailAdapter.sendMail({
      to: {
        name,
        email
      },
      subject,
      content: mailContent
    })
    return session
  }
}
