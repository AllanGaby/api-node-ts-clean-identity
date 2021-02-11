import { AccountModel } from '@/domain/models/auth'

export interface ShowAccountDTO {
  accountId: string
}

export interface ShowAccountUseCase {
  show: (filter: ShowAccountDTO) => Promise<AccountModel>
}
