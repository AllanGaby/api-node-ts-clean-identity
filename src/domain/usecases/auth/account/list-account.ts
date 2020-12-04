import { AccountModel } from '@/domain/models/auth'

export interface ListAccountDTO {
  name: string
  email: string
}

export interface ListAccount {
  list: (filter: ListAccountDTO) => Promise<AccountModel[]>
}
