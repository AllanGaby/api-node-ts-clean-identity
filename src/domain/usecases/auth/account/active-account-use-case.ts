import { AccountModel } from '@/domain/models/auth'

export interface ActiveAccountDTO {
  sessionId: string
}

export interface ActiveAccountUseCase {
  active: (data: ActiveAccountDTO) => Promise<AccountModel>
}
