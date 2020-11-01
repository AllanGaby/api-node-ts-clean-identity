import { AccountModel } from '@/domain/models/auth'
import { ListAccountFilter } from '@/domain/usecases/auth/account'

export type ListAccountRepositoryFilter = ListAccountFilter

export interface ListAccountRepository {
  list: (filter: ListAccountFilter) => Promise<AccountModel[]>
}
