import { AccountModel, AccountType } from '@/domain/models/auth'

export interface UpdateAccountDTO {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  type?: AccountType
  avatar_extention?: string
}

export interface UpdateAccountRepository {
  update: (update: UpdateAccountDTO) => Promise<AccountModel>
}
