import { AddAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'

export interface CreateAccount {
  add: (data: AddAccountDTO) => Promise<AccountModel>
}
