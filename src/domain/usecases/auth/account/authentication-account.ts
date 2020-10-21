import { AuthenticationAccountDTO } from '@/domain/dtos/auth/account'

export interface AuthenticationAccount {
  authenticate: (data: AuthenticationAccountDTO) => Promise<string>
}
