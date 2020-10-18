import { AddAccountDTO } from '@/data/dtos/auth/account'
import { Account } from '@/data/models/auth'

export interface CreateAccount {
  add: (data: AddAccountDTO) => Promise<Account>
}
