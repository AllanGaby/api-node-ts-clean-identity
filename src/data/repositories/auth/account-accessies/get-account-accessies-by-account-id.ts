import { AccountAccessiesModel } from '@/domain/models/auth'

export interface GetAccountAccessiesByAccountIdRepository {
  getAccountAccessiesByAccountId: (accountId: string) => Promise<AccountAccessiesModel>
}
