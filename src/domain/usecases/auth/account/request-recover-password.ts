import { SessionModel } from '@/domain/models/auth'

export interface RequestRecoverPasswordDTO {
  email: string
}

export interface RequestRecoverPassword {
  request: (data: RequestRecoverPasswordDTO) => Promise<SessionModel>
}
