import { AccountModel, AccountType } from '@/domain/models/auth'

export interface UpdateAccountModel {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  type?: AccountType
}

export interface UpdateAccountRepository {
  update: (update: UpdateAccountModel) => Promise<AccountModel>
}
