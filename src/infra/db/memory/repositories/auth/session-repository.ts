import { CreateSessionModel, CreateSessionRepository, GetSessionByIdRepository, DeleteSessionRepository } from '@/data/repositories/auth/session'
import { SessionModel } from '@/domain/models/auth'
import faker from 'faker'

export class MemorySessionRepository implements CreateSessionRepository, GetSessionByIdRepository, DeleteSessionRepository {
  private readonly sessions: SessionModel[]
  private static instance: MemorySessionRepository

  private constructor () {
    this.sessions = []
  }

  public static getInstance (): MemorySessionRepository {
    if (!MemorySessionRepository.instance) {
      MemorySessionRepository.instance = new MemorySessionRepository()
    }
    return MemorySessionRepository.instance
  }

  async create (createSession: CreateSessionModel): Promise<SessionModel> {
    const session: SessionModel = {
      id: faker.random.uuid(),
      account_id: createSession.account_id,
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
    if (deletedSession) {
      const index = this.sessions.findIndex(session => session.id === deletedSession.id)
      if (index >= 0) {
        this.sessions.splice(index)
      }
    }
  }
}
