import { AccountModel } from '@/domain/models/auth'
import { ActiveAccountDTO } from '@/domain/dtos/auth/account'

export interface ActiveAccount {
  active: (data: ActiveAccountDTO) => Promise<AccountModel>
}
