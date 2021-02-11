import { AccountModel } from '@/domain/models/auth'

export interface RecoverPasswordDTO {
  sessionId: string
  password: string
}

export interface RecoverPasswordUseCase {
  recover: (data: RecoverPasswordDTO) => Promise<AccountModel>
}
