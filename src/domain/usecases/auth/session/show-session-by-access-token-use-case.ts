import { SessionModel } from '@/domain/models/auth'

export interface ShowSessionByAccessTokenDTO {
  accessToken: string
}

export interface ShowSessionByAccessTokenUseCase {
  show: (filter: ShowSessionByAccessTokenDTO) => Promise<SessionModel>
}
