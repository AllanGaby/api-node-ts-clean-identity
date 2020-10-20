import { SendMailActiveAccountDTO } from '@/domain/dtos/auth/account'
import { SendMailActiveAccount } from '@/domain/usecases/auth/account'
import { SessionModel, SessionType } from '@/domain/models/auth'
import { CreateSessionRepository } from '@/data/repositories/auth/session'

export class DbSendMailActiveAccount implements SendMailActiveAccount {
  constructor (
    private readonly createSessionRepository: CreateSessionRepository
  ) {}

  async sendMail ({ accountId, email, name }: SendMailActiveAccountDTO): Promise<SessionModel> {
    await this.createSessionRepository.add({
      accountId,
      type: SessionType.activeAccount,
      experied_at: new Date(new Date().getDate() + 1)
    })

    return null
  }
}
