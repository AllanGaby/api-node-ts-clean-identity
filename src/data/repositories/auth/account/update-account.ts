import { AccountModel } from '@/domain/models/auth'

export interface UpdateAccountRepository {
  update: (update: AccountModel) => Promise<AccountModel>
}
