import { AccountModel } from '@/domain/models/auth'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface CreateAccountRepository {
  add: (data: AddAccountModel) => Promise<AccountModel>
}
