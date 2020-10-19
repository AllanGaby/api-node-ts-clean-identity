import { AccountModel } from '@/domain/models/auth'

export interface CreateAccountModel {
  name: string
  email: string
  password: string
}

export interface CreateAccountRepository {
  add: (data: CreateAccountModel) => Promise<AccountModel>
}
