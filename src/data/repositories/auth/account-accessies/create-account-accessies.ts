import { AccountAccessiesModel } from '@/domain/models/auth'

export interface CreateAccountAccessiesRepository {
  create: (accountAccessies: AccountAccessiesModel) => Promise<AccountAccessiesModel>
}
