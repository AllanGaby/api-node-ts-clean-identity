import { SessionModel } from '@/domain/models/auth'

export interface ShowSessionByAccessTokenDTO {
  accessToken: string
}

export interface ShowSessionByAccessToken {
  show: (filter: ShowSessionByAccessTokenDTO) => Promise<SessionModel>
}
