import { RecoverPassword } from '@/domain/usecases/auth/account'
import { RecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'
import { HashCreator } from '@/data/protocols/criptography'

export class DbRecoverPassword implements RecoverPassword {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hashCreator: HashCreator
  ) {}

  async recover ({ password, sessionId }: RecoverPasswordDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if ((session) &&
        (session.type === SessionType.recoverPassword) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      const account = await this.getAccountByIdRepository.getAccountById(session.accountId)
      account.password = await this.hashCreator.createHash(password)
    }
    return null
  }
}
