import { SetAccountAccessies } from '@/domain/usecases/auth/account-accessies'
import { AccountAccessiesModel } from '@/domain/models/auth'
import { CreateAccountAccessiesRepository, GetAccountAccessiesByAccountIdRepository } from '@/data/repositories/auth/account-accessies'

export class DbSetAccountAccessies implements SetAccountAccessies {
  constructor (
    private readonly getAccountAccessiesByAccountIdRepository: GetAccountAccessiesByAccountIdRepository,
    private readonly createAccountAccessiesRepository: CreateAccountAccessiesRepository
  ) {}

  async set (accountAccessies: AccountAccessiesModel): Promise<AccountAccessiesModel> {
    const accountAccessiesByAccountId = await this.getAccountAccessiesByAccountIdRepository.getAccountAccessiesByAccountId(accountAccessies.accountId)
    if (!accountAccessiesByAccountId) {
      await this.createAccountAccessiesRepository.create(accountAccessies)
    }
    return null
  }
}
