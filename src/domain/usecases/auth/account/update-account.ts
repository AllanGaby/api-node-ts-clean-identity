import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'

export interface UpdateAccount {
  update: (data: UpdateAccountDTO) => Promise<AccountModel>
}
