import { SessionModel, SessionType } from '@/domain/models/auth'

export interface CreateSessionModel {
  accountId: string
  type: SessionType
  experied_at: Date
}

export interface CreateSessionRepository {
  create: (data: CreateSessionModel) => Promise<SessionModel>
}
