import { CreateSessionRepository, CreateSessionModel, GetSessionByIdRepository } from '@/data/repositories/auth/session'
import { DeleteSessionRepository } from '@/data/repositories/auth/session/delete-session'
import { SessionModel } from '@/domain/models/auth'
import { mockSessionModel } from './mock-session'

export class CreateSessionRepositorySpy implements CreateSessionRepository {
  params: CreateSessionModel
  session: SessionModel = mockSessionModel()

  async create (params: CreateSessionModel): Promise<SessionModel> {
    this.params = params
    return this.session
  }
}

export class GetSessionByIdRepositorySpy implements GetSessionByIdRepository {
  sessionId: string
  session: SessionModel = mockSessionModel()

  async getSessionById (sessionId: string): Promise<SessionModel> {
    this.sessionId = sessionId
    return this.session
  }
}

export class DeleteSessionRepositorySpy implements DeleteSessionRepository {
  session: SessionModel

  async delete (session: SessionModel): Promise<void> {
    this.session = session
  }
}
