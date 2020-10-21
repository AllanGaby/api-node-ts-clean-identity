import { RequestRecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { RequestRecoverPassword } from '@/domain/usecases/auth/account'
import { GetAccountByEmailRepository } from '@/data/repositories/auth/account'
import { CreateSessionRepository } from '@/data/repositories/auth/session'
import { SessionType } from '@/domain/models/auth'

export class DbRequestRecoverPassword implements RequestRecoverPassword {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly createSessionRepository: CreateSessionRepository
  ) {}

  async request ({ email }: RequestRecoverPasswordDTO): Promise<boolean> {
    const accountByEmail = await this.getAccountByEmailRepository.getAccountByEmail(email)
    if (accountByEmail) {
      await this.createSessionRepository.add({
        accountId: accountByEmail.id,
        type: SessionType.recoverPassword,
        experied_at: new Date(new Date().getDate() + 1)
      })
    }
    return false
  }
}
