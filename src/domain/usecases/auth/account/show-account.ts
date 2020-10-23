import { AccountModel } from '@/domain/models/auth'

export interface ShowAccountFilter {
  accountId: string
}

export interface ShowAccount {
  show: (filter: ShowAccountFilter) => Promise<AccountModel>
}
