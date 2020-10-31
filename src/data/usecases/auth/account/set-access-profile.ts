import { SetAccessProfile, SetAccessProfileDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'

export class DbSetAccessProfile implements SetAccessProfile {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository
  ) {}

  async setAccessProfile ({ accountId }: SetAccessProfileDTO): Promise<AccountModel> {
    await this.getAccountByIdRepository.getAccountById(accountId)
    return null
  }
}
