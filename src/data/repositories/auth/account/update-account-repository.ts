import { AccountModel } from '@/domain/models/auth'

export interface UpdateAccountDTO {
  id: string
  name: string
  email: string
  password: string
  email_valided: boolean
  avatar_file_id: string
}

export interface UpdateAccountRepository {
  update: (update: UpdateAccountDTO) => Promise<AccountModel>
}
