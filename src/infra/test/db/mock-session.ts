import { CreateSessionModel } from '@/data/repositories/auth/session'
import { SessionType } from '@/domain/models/auth'
import faker from 'faker'

export const mockCreateSessionModel = (sessionType: SessionType = SessionType.authentication, experiedAt: Date = new Date()): CreateSessionModel => ({
  accountId: faker.random.uuid(),
  type: sessionType,
  experied_at: experiedAt
})
