import { SessionModel } from '@/domain/models/auth'

export interface CreateAccountDTO {
  name: string
  email: string
  password: string
}

export interface CreateAccountUseCase {
  create: (data: CreateAccountDTO) => Promise<SessionModel>
}
