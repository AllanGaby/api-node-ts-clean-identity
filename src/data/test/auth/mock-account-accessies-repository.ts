import { GetAccountAccessiesByAccountIdRepository } from '@/data/repositories/auth/account-accessies'
import { AccountAccessiesModel } from '@/domain/models/auth'

export class GetAccountAccessiesByAccountIdRepositorySpy implements GetAccountAccessiesByAccountIdRepository {
  accountId: string
  accountAccessies: AccountAccessiesModel

  async getAccountAccessiesByAccountId (accountId: string): Promise<AccountAccessiesModel> {
    this.accountId = accountId
    return this.accountAccessies
  }
}
