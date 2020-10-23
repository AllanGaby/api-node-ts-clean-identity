import { AccountModel } from '@/domain/models/auth'
import { ShowAccountFilter } from '@/domain/usecases/auth/account'

export interface ShowAccountRepository {
  show: (filter: ShowAccountFilter) => Promise<AccountModel>
}
