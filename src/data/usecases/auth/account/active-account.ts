import { ActiveAccount, ActiveAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'
import { GetSessionByIdRepository, DeleteSessionRepository } from '@/data/repositories/auth/session'

export class DbActiveAccount implements ActiveAccount {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly deleteSessionRepository: DeleteSessionRepository
  ) {}

  async active ({ sessionId }: ActiveAccountDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if ((session) &&
        (session.type === SessionType.activeAccount) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      const account = await this.getAccountByIdRepository.getAccountById(session.accountId)
      if (!account.email_valided) {
        await this.deleteSessionRepository.delete(session)
        account.email_valided = true
        const updatedAccount = await this.updateAccountRepository.update(account)
        return updatedAccount
      }
    }
    return null
  }
}
