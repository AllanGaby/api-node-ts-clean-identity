import { SessionModel } from '@/domain/models/auth'

export interface GetSessionByIdRepository {
  getSessionById: (sessionId: string) => Promise<SessionModel>
}
