import { CreateSessionModel } from '@/data/repositories/auth/session'
import { SessionType } from '@/domain/models/auth'
import faker from 'faker'

export const mockCreateSessionModel = (type: SessionType = SessionType.authentication): CreateSessionModel => ({
  accountId: faker.random.uuid(),
  type,
  experied_at: new Date()
})
