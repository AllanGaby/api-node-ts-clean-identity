import { SendMailActiveAccountDTO } from '@/domain/dtos/auth/account'
import { SendMailActiveAccount } from '@/domain/usecases/auth/account'
import { SessionModel, SessionType } from '@/domain/models/auth'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { MailTemplateAdapter } from '@/data/protocols/comunication/mail'

export class DbSendMailActiveAccount implements SendMailActiveAccount {
  constructor (
    private readonly createSessionRepository: CreateSessionRepository,
    private readonly mailTemplateAdapter: MailTemplateAdapter,
    private readonly mailFilePath: string
  ) {}

  async sendMail ({ accountId, email, name }: SendMailActiveAccountDTO): Promise<SessionModel> {
    const session = await this.createSessionRepository.add({
      accountId,
      type: SessionType.activeAccount,
      experied_at: new Date(new Date().getDate() + 1)
    })
    const variables = {
      sessionId: session.id,
      name
    }
    await this.mailTemplateAdapter.parse({
      filePath: this.mailFilePath,
      variables
    })

    return session
  }
}
