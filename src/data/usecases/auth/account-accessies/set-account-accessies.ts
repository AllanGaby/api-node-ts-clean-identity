import { SetAccountAccessies } from '@/domain/usecases/auth/account-accessies'
import { AccountAccessiesModel } from '@/domain/models/auth'
import { CreateAccountAccessiesRepository, GetAccountAccessiesByAccountIdRepository, UpdateAccountAccessiesRepository } from '@/data/repositories/auth/account-accessies'

export class DbSetAccountAccessies implements SetAccountAccessies {
  constructor (
    private readonly getAccountAccessiesByAccountIdRepository: GetAccountAccessiesByAccountIdRepository,
    private readonly createAccountAccessiesRepository: CreateAccountAccessiesRepository,
    private readonly updateAccountAccessiesRepository: UpdateAccountAccessiesRepository
  ) {}

  async set (accountAccessies: AccountAccessiesModel): Promise<AccountAccessiesModel> {
    const accountAccessiesByAccountId = await this.getAccountAccessiesByAccountIdRepository.getAccountAccessiesByAccountId(accountAccessies.accountId)
    if (!accountAccessiesByAccountId) {
      return await this.createAccountAccessiesRepository.create(accountAccessies)
    } else {
      return await this.updateAccountAccessiesRepository.update(accountAccessies)
    }
  }
}
