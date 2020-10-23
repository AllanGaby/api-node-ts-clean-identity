import { AccountAccessiesModel } from '@/domain/models/auth'

export interface UpdateAccountAccessiesRepository {
  update: (accountAccessies: AccountAccessiesModel) => Promise<AccountAccessiesModel>
}
