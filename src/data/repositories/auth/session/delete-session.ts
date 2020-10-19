import { SessionModel } from '@/domain/models/auth'

export interface DeleteSessionRepository {
  delete: (session: SessionModel) => Promise<void>
}
