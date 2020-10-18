import { SessionModel, SessionType } from '@/domain/models/auth'

export interface AddSessionModel {
  accountId: string
  type: SessionType
  experied_at: Date
}

export interface CreateSessionRepository {
  add: (data: AddSessionModel) => Promise<SessionModel>
}
