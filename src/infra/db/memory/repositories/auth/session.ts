import { MemorySessionModel } from '@/infra/db/memory/models/auth'
import { CreateSessionModel, CreateSessionRepository } from '@/data/repositories/auth/session'
import faker from 'faker'

export class MemorySessionRepository implements CreateSessionRepository {
  private readonly sessions: MemorySessionModel[]

  constructor () {
    this.sessions = []
  }

  async create (createSession: CreateSessionModel): Promise<MemorySessionModel> {
    const session: MemorySessionModel = {
      id: faker.random.uuid(),
      accountId: createSession.accountId,
      type: createSession.type,
      experied_at: createSession.experied_at,
      created_at: new Date(),
      updated_at: new Date()
    }
    this.sessions.push(session)
    return session
  }
}
