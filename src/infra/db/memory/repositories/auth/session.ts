import { CreateSessionModel, CreateSessionRepository, GetSessionByIdRepository, DeleteSessionRepository } from '@/data/repositories/auth/session'
import { SessionModel } from '@/domain/models/auth'
import faker from 'faker'

export class MemorySessionRepository implements CreateSessionRepository, GetSessionByIdRepository, DeleteSessionRepository {
  private readonly sessions: SessionModel[]

  constructor () {
    this.sessions = []
  }

  async create (createSession: CreateSessionModel): Promise<SessionModel> {
    const session: SessionModel = {
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

  async getSessionById (sessionId: string): Promise<SessionModel> {
    return this.sessions.find(session => session.id === sessionId)
  }

  async delete (deletedSession: SessionModel): Promise<void> {
    const index = this.sessions.findIndex(session => session.id === deletedSession.id)
    if (index >= 0) {
      this.sessions.splice(index)
    }
  }
}
