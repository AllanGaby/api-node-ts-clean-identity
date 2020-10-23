import { AccountModel } from '@/domain/models/auth'

export interface ActiveAccountDTO {
  sessionId: string
}

export interface ActiveAccount {
  active: (data: ActiveAccountDTO) => Promise<AccountModel>
}
