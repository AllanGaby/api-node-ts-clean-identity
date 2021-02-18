import { CreateSessionModel, CreateSessionRepository, GetSessionByIdRepository, DeleteSessionByIdRepository, DeleteSessionByAccountIdRepository, GetSessionByAccountIdRepository } from '@/data/repositories/auth/session'
import { SessionModel } from '@/domain/models/auth'
import faker from 'faker'

export class MemorySessionRepository implements CreateSessionRepository, GetSessionByIdRepository, DeleteSessionByIdRepository, DeleteSessionByAccountIdRepository, GetSessionByAccountIdRepository {
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
    if (!sessionId) {
      return undefined
    }
    return this.sessions.find(session => session.id === sessionId)
  }

  async deleteById (sessionId: string): Promise<void> {
    if (sessionId) {
      const index = this.sessions.findIndex(session => session.id === sessionId)
      if (index >= 0) {
        this.sessions[index] = {
          ...this.sessions[index],
          deleted_at: new Date(),
          updated_at: new Date()
        }
      }
    }
  }

  async deleteByAccountId (accountId: string): Promise<void> {
    if (accountId) {
      for (let index = 0; index < this.sessions.length; index++) {
        if (this.sessions[index].account_id === accountId) {
          this.sessions[index] = {
            ...this.sessions[index],
            deleted_at: new Date(),
            updated_at: new Date()
          }
        }
      }
    }
  }

  async getSessionByAccountId (accountId: string): Promise<SessionModel[]> {
    if (!accountId) {
      return []
    }
    return this.sessions.filter(session => session.account_id === accountId)
  }
}
