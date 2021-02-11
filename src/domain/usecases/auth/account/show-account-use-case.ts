import { AccountModel } from '@/domain/models/auth'

export interface ShowAccountDTO {
  accountId: string
}

export interface ShowAccount {
  show: (filter: ShowAccountDTO) => Promise<AccountModel>
}
