import { ActiveAccount } from '@/domain/usecases/auth/account'
import { ActiveAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetSessionByIdRepository } from '@/data/repositories/auth/session'

export class DbActiveAccount implements ActiveAccount {
  constructor (
    private readonly getSessionByIdRepository: GetSessionByIdRepository
  ) {}

  async active ({ sessionId }: ActiveAccountDTO): Promise<AccountModel> {
    await this.getSessionByIdRepository.getSessionById(sessionId)
    return null
  }
}
