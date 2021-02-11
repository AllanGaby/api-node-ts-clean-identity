import { ActiveAccountUseCase, ActiveAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetAccountByIdRepository, UpdateAccountRepository, GetSessionByIdRepository, DeleteSessionByIdRepository } from '@/data/repositories/auth'
import { InvalidCredentialsError } from '@/data/errors'

export class DbActiveAccountUseCase implements ActiveAccountUseCase {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly deleteSessionByIdRepository: DeleteSessionByIdRepository
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
      this.deleteSessionByIdRepository.deleteById(session.id)
      if (account) {
        if (!account.email_valided) {
          account.email_valided = true
          const updatedAccount = await this.updateAccountRepository.update(account)
          return updatedAccount
        } else {
          return account
        }
      }
    }
    throw new InvalidCredentialsError()
  }
}
