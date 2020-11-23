import { ActiveAccount, ActiveAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { GetSessionByIdRepository, DeleteSessionRepository } from '@/data/repositories/auth/session'
import { InvalidCredentialsError } from '@/data/errors'

export class DbActiveAccount implements ActiveAccount {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly deleteSessionRepository: DeleteSessionRepository
  ) {}

  async active ({ sessionId }: ActiveAccountDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if (!session) {
      throw new InvalidCredentialsError()
    }
    if ((session.type === SessionType.activeAccount) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      const account = await this.getAccountByIdRepository.getAccountById(session.account_id)
      if (!account.email_valided) {
        await this.deleteSessionRepository.delete(session)
        account.email_valided = true
        const updatedAccount = await this.updateAccountRepository.update(account)
        return updatedAccount
      }
    } else {
      throw new InvalidCredentialsError()
    }
  }
}
