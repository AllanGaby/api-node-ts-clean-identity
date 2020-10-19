import { CreateAccountDTO } from '@/domain/dtos/auth/account'
import { SessionModel } from '@/domain/models/auth'

export interface CreateAccount {
  add: (data: CreateAccountDTO) => Promise<SessionModel>
}
