import { ShowAccountAccessies, ShowAccountAccessiesFilter } from '@/domain/usecases/auth/account-accessies'
import { AccountAccessiesModel } from '@/domain/models/auth'
import { GetAccountAccessiesByAccountIdRepository } from '@/data/repositories/auth/account-accessies'

export class DbShowAccountAccessies implements ShowAccountAccessies {
  constructor (private readonly getAccountAccessiesByAccountIdRepository: GetAccountAccessiesByAccountIdRepository) {}

  async show (filter: ShowAccountAccessiesFilter): Promise<AccountAccessiesModel> {
    return await this.getAccountAccessiesByAccountIdRepository.getAccountAccessiesByAccountId(filter.accountId)
  }
}
