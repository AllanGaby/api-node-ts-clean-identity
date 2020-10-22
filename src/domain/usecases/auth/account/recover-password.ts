import { RecoverPasswordDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'

export interface RecoverPassword {
  recover: (data: RecoverPasswordDTO) => Promise<AccountModel>
}
