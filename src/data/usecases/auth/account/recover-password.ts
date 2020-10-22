import { RecoverPassword } from '@/domain/usecases/auth/account'
import { RecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'

export class DbRecoverPassword implements RecoverPassword {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository
  ) {}

  async recover ({ password, sessionId }: RecoverPasswordDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if ((session) &&
        (session.type === SessionType.recoverPassword) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      await this.getAccountByIdRepository.getAccountById(session.accountId)
    }
    return null
  }
}
