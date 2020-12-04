import { ShowAccountBySession, ShowAccountBySessionDTO, Logout, LogoutDTO } from '@/domain/usecases/auth/session'
import { AccountModel } from '@/domain/models/auth'
import { mockAccountModel } from '@/data/test'
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