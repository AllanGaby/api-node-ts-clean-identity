import { AccountAccessiesModel } from '@/domain/models/auth'

export interface SetAccountAccessies {
  set: (accountAccessies: AccountAccessiesModel) => Promise<AccountAccessiesModel>
}
