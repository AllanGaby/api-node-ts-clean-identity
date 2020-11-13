import { CreateSessionModel } from '@/data/repositories/auth/session'
import { SessionType, SessionModel } from '@/domain/models/auth'
import faker from 'faker'

export const mockCreateSessionModel = (type: SessionType = SessionType.authentication): CreateSessionModel => ({
  accountId: faker.random.uuid(),
  type,
  experied_at: new Date()
})

export const mockSessionModel = (type: SessionType = SessionType.authentication): SessionModel => ({
  accountId: faker.random.uuid(),
  created_at: faker.date.past(),
  updated_at: faker.date.past(),
  experied_at: faker.date.future(),
  id: faker.random.uuid(),
  type
})
