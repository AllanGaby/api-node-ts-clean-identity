import { SendMailSessionDTO, ShowAccountBySessionDTO, LogoutDTO, ShowSessionByAccessTokenDTO, AuthenticationAccountDTO } from '@/domain/usecases/auth/session'
import { SessionModel, SessionType, AuthenticationModel } from '@/domain/models/auth'
import faker from 'faker'

export const mockSessionModel = (type: SessionType = SessionType.activeAccount): SessionModel => ({
  id: faker.random.uuid(),
  account_id: faker.random.uuid(),
  type,
  experied_at: faker.date.future(),
  created_at: faker.date.past(),
  updated_at: faker.date.past()
})

export const mockSendMailSessionDTO = (sessionType: SessionType, subject: string = faker.random.words()): SendMailSessionDTO => ({
  accountId: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  mailFilePath: faker.internet.url(),
  subject,
  sessionType
})

export const mockShowAccountBySessionDTO = (): ShowAccountBySessionDTO => ({
  accessToken: faker.random.uuid()
})

export const mockShowSessionByAccessTokenDTO = (): ShowSessionByAccessTokenDTO => ({
  accessToken: faker.random.uuid()
})

export const mockLogoutDTO = (): LogoutDTO => ({
  sessionId: faker.random.uuid()
})

export const mockAuthenticationAccountDTO = (): AuthenticationAccountDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (): AuthenticationModel => ({
  access_token: faker.random.uuid(),
  account: {
    name: faker.name.findName(),
    id: faker.random.uuid()
  }
})
