import { GetAccountAccessiesByAccountIdRepository, CreateAccountAccessiesRepository, UpdateAccountAccessiesRepository } from '@/data/repositories/auth/account-accessies'
import { AccountAccessiesModel } from '@/domain/models/auth'
import { mockAccountAccessiesModel } from './mock-account-accessies'

export class GetAccountAccessiesByAccountIdRepositorySpy implements GetAccountAccessiesByAccountIdRepository {
  accountId: string
  accountAccessies: AccountAccessiesModel = mockAccountAccessiesModel()

  async getAccountAccessiesByAccountId (accountId: string): Promise<AccountAccessiesModel> {
    this.accountId = accountId
    return this.accountAccessies
  }
}

export class CreateAccountAccessiesRepositorySpy implements CreateAccountAccessiesRepository {
  accountAccessies: AccountAccessiesModel

  async create (accountAccessies: AccountAccessiesModel): Promise<AccountAccessiesModel> {
    this.accountAccessies = accountAccessies
    return this.accountAccessies
  }
}

export class UpdateAccountAccessiesRepositorySpy implements UpdateAccountAccessiesRepository {
  accountAccessies: AccountAccessiesModel

  async update (accountAccessies: AccountAccessiesModel): Promise<AccountAccessiesModel> {
    this.accountAccessies = accountAccessies
    return this.accountAccessies
  }
}
