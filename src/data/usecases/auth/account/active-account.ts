import { ActiveAccount } from '@/domain/usecases/auth/account'
import { ActiveAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel, SessionType } from '@/domain/models/auth'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'

export class DbActiveAccount implements ActiveAccount {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository,
    private readonly getAccountByIdRepository: GetAccountByIdRepository
  ) {}

  async active ({ sessionId }: ActiveAccountDTO): Promise<AccountModel> {
    const session = await this.getSessionByIdRepository.getSessionById(sessionId)
    if ((session) &&
        (session.type === SessionType.activeAccount) &&
        (session.experied_at > new Date()) &&
        (!session.deleted_at)) {
      await this.getAccountByIdRepository.getAccountById(session.accountId)
    }
    return null
  }
}
