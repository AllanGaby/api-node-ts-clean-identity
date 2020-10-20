import { SendMailActiveAccountDTO } from '@/domain/dtos/auth/account'
import { SendMailActiveAccount } from '@/domain/usecases/auth/account'
import { SessionModel, SessionType } from '@/domain/models/auth'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { MailTemplateAdapter, SendMailAdapter } from '@/data/protocols/comunication/mail'

export class DbSendMailActiveAccount implements SendMailActiveAccount {
  constructor (
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly mailTemplateAdapter: MailTemplateAdapter,
    private readonly sendMailAdapter: SendMailAdapter
  ) {}

  async sendMail ({ accountId, email, name, subject, mailFilePath }: SendMailActiveAccountDTO): Promise<SessionModel> {
    const session = await this.createSessionRepository.add({
      accountId,
      type: SessionType.activeAccount,
      experied_at: new Date(new Date().getDate() + 1)
    })
    const variables = {
      sessionId: session.id,
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
