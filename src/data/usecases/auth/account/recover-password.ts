import { RecoverPassword, RecoverPasswordDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { HashCreator } from '@/data/protocols/criptography'

export class DbRecoverPassword implements RecoverPassword {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hashCreator: HashCreator,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) {}

  async recover ({ password, sessionId }: RecoverPasswordDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    if ((session.type === SessionType.recoverPassword) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      const account = await this.getAccountByIdRepository.getAccountById(session.account_id)
      account.password = await this.hashCreator.createHash(password)
      return await this.updateAccountRepository.update(account)
    } else {
      throw new Error('Invalid Session')
    }
  }
}
