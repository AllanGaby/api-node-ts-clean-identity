import { AccountModel } from '@/domain/models/auth'

export interface UpdateAccountDTO {
  id: string
  name?: string
  email?: string
  password?: string
  new_password?: string
}

export interface UpdateAccountUseCase {
  update: (data: UpdateAccountDTO) => Promise<AccountModel>
}
