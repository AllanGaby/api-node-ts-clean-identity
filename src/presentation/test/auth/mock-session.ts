import { ShowAccountBySession, ShowAccountBySessionDTO, Logout, LogoutDTO, ShowSessionByAccessToken, ShowSessionByAccessTokenDTO } from '@/domain/usecases/auth/session'
import { AccountModel, SessionModel } from '@/domain/models/auth'
import { mockAccountModel, mockSessionModel } from '@/data/test'
import { HttpRequest } from '@/presentation/protocols'
import { LogoutRequest } from '@/presentation/controllers/auth/session'
import faker from 'faker'

export class ShowAccountBySessionSpy implements ShowAccountBySession {
  params: ShowAccountBySessionDTO
  account: AccountModel = mockAccountModel()

  async show (params: ShowAccountBySessionDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export const mockAuthenticationFailRequest = (): HttpRequest<any> => ({
  headers: {
    [faker.database.column()]: faker.random.uuid()
  }
})

export const mockAuthenticationRequest = (): HttpRequest<any> => ({
  headers: {
    'x-access-token': faker.random.uuid()
  }
})

export class LogoutSpy implements Logout {
  params: LogoutDTO
  error: Error = null

  async logout (params: LogoutDTO): Promise<void> {
    this.params = params
  }
}

export const mockLogoutRequest = (): HttpRequest<LogoutRequest> => ({
  body: {
    sessionId: faker.random.uuid()
  }
})

export class ShowSessionByAccessTokenSpy implements ShowSessionByAccessToken {
  params: ShowSessionByAccessTokenDTO
  session: SessionModel = mockSessionModel()

  async show (params: ShowSessionByAccessTokenDTO): Promise<SessionModel> {
    this.params = params
    return this.session
  }
}
