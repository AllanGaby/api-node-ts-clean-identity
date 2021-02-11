import { SessionModel } from '@/domain/models/auth'

export interface RequestRecoverPasswordDTO {
  email: string
}

export interface RequestRecoverPasswordUseCase {
  request: (data: RequestRecoverPasswordDTO) => Promise<SessionModel>
}
