import { RecoverPassword, RecoverPasswordDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetSessionByIdRepository, GetAccountByIdRepository, UpdateAccountRepository, DeleteSessionByAccountIdRepository } from '@/data/repositories/auth'
import { HashCreator } from '@/data/protocols/criptography'
import { InvalidCredentialsError } from '@/data/errors'

export class DbRecoverPassword implements RecoverPassword {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly hashCreator: HashCreator,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly deleteSessionByAccountId: DeleteSessionByAccountIdRepository
  ) {}

  async recover ({ password, sessionId }: RecoverPasswordDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if (!session) {
      throw new InvalidCredentialsError()
    }
    if ((session.type === SessionType.recoverPassword) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      await this.deleteSessionByAccountId.deleteByAccountId(session.account_id)
      const account = await this.getAccountByIdRepository.getAccountById(session.account_id)
      account.password = await this.hashCreator.createHash(password)
      return await this.updateAccountRepository.update(account)
    }
    throw new InvalidCredentialsError()
  }
}
