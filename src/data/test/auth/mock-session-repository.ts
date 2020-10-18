import { CreateSessionRepository, AddSessionModel } from '@/data/repositories/auth/session'
import { SessionModel } from '@/domain/models/auth'

export class CreateSessionRepositorySpy implements CreateSessionRepository {
  addSessionParams: AddSessionModel
  session: SessionModel

  async add (data: AddSessionModel): Promise<SessionModel> {
    this.addSessionParams = data
    return this.session
  }
}
