import { AccountModel } from '@/domain/models/auth'

export interface ListAccountFilter {
  name: string
  email: string
}

export interface ListAccount {
  list: (filter: ListAccountFilter) => Promise<AccountModel[]>
}
