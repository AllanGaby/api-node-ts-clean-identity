import { SetAccountAccessies } from '@/domain/usecases/auth/account-accessies'
import { AccountAccessiesModel } from '@/domain/models/auth'
import { GetAccountAccessiesByAccountIdRepository } from '@/data/repositories/auth/account-accessies'

export class DbSetAccountAccessies implements SetAccountAccessies {
  constructor (
    private readonly getAccountAccessiesByAccountIdRepository: GetAccountAccessiesByAccountIdRepository
  ) {}

  async set (data: AccountAccessiesModel): Promise<AccountAccessiesModel> {
    await this.getAccountAccessiesByAccountIdRepository.getAccountAccessiesByAccountId(data.accountId)
    return null
  }
}
