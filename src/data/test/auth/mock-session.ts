import { ActiveAccountDTO } from '@/domain/dtos/auth/account'
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
