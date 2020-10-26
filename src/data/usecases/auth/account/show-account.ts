import { ShowAccount, ShowAccountFilter } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'

export class DbShowAccount implements ShowAccount {
  constructor (private readonly getAccountByIdRepository: GetAccountByIdRepository) {}

  async show ({ accountId }: ShowAccountFilter): Promise<AccountModel> {
    return await this.getAccountByIdRepository.getAccountById(accountId)
  }
}
