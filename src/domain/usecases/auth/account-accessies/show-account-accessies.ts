import { AccountAccessiesModel } from '@/domain/models/auth'

export interface ShowAccountAccessiesFilter {
  accountId: string
}

export interface ShowAccountAccessies {
  show: (filter: ShowAccountAccessiesFilter) => Promise<AccountAccessiesModel>
}
