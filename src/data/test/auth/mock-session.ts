import { ActiveAccountDTO, RecoverPasswordDTO } from '@/domain/usecases/auth/account'
import { SendMailSessionDTO } from '@/domain/usecases/auth/session'
import { SessionModel, SessionType } from '@/domain/models/auth'
import faker from 'faker'

export const mockSessionModel = (type: SessionType = SessionType.activeAccount): SessionModel => ({
  id: faker.random.uuid(),
  accountId: faker.random.uuid(),
  type,
  experied_at: faker.date.future(),
  created_at: faker.date.past(),
  updated_at: faker.date.past()
})

export const mockActiveAccountDTO = (): ActiveAccountDTO => ({
  sessionId: faker.random.uuid()
})

export const mockSendMailSessionDTO = (sessionType: SessionType, subject: string = faker.random.words()): SendMailSessionDTO => ({
  accountId: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  mailFilePath: faker.internet.url(),
  subject,
  sessionType
})

export const mockRecoverPasswordDTO = (): RecoverPasswordDTO => ({
  sessionId: faker.random.uuid(),
  password: faker.internet.password()
})
