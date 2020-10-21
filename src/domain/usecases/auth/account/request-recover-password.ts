import { RequestRecoverPasswordDTO } from '@/domain/dtos/auth/account'

export interface RequestRecoverPassword {
  request: (data: RequestRecoverPasswordDTO) => Promise<void>
}
