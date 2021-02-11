import { AccountModel } from '@/domain/models/auth'

export interface ShowAccountBySessionDTO {
  accessToken: string
}

export interface ShowAccountBySessionUseCase {
  show: (filter: ShowAccountBySessionDTO) => Promise<AccountModel>
}
