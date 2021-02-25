import { ShowAccountBySessionUseCase, ShowAccountBySessionDTO, LogoutUseCase, LogoutDTO, ShowSessionByAccessTokenUseCase, ShowSessionByAccessTokenDTO, AuthenticationAccountUseCase, AuthenticationAccountDTO } from '@/domain/usecases/auth/session'
import { AccountModel, AuthenticationModel, SessionModel, SessionType } from '@/domain/models/auth'
import { mockAccountModel, mockAuthenticationModel, mockSessionModel } from '@/data/tests'
import { HttpRequest } from '@/presentation/protocols'
import { LogoutRequest } from '@/presentation/controllers/auth/session'
import faker from 'faker'

export class ShowAccountBySessionSpy implements ShowAccountBySessionUseCase {
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

export const mockAuthenticationRequest = (tokenName: string): HttpRequest<any> => ({
  headers: {
    [tokenName]: faker.random.uuid()
  }
})

export class LogoutSpy implements LogoutUseCase {
  params: LogoutDTO
  error: Error = null

  async logout (params: LogoutDTO): Promise<void> {
    this.params = params
  }
}

export const mockLogoutRequest = (): HttpRequest<LogoutRequest> => ({
  body: {
    session: {
      sessionId: faker.random.uuid()
    }
  }
})

export class ShowSessionByAccessTokenSpy implements ShowSessionByAccessTokenUseCase {
  params: ShowSessionByAccessTokenDTO
  session: SessionModel = mockSessionModel(SessionType.authentication)

  async show (params: ShowSessionByAccessTokenDTO): Promise<SessionModel> {
    this.params = params
    return this.session
  }
}

export class AuthenticationAccountSpy implements AuthenticationAccountUseCase {
  params: AuthenticationAccountDTO
  authentication: AuthenticationModel = mockAuthenticationModel()

  async authenticate (params: AuthenticationAccountDTO): Promise<AuthenticationModel> {
    this.params = params
    return this.authentication
  }
}

export const mockAuthenticationAccountRequest = (): HttpRequest<AuthenticationAccountDTO> => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})
