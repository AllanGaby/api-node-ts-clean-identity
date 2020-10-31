import { AccountModel } from '@/domain/models/auth'

export interface UpdateAccountModel {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  accessProfileId?: string
}

export interface UpdateAccountRepository {
  update: (update: UpdateAccountModel) => Promise<AccountModel>
}
