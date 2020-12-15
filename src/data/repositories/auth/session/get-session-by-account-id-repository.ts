import { SessionModel } from '@/domain/models/auth'

export interface GetSessionByAccountIdRepository {
  getSessionByAccountId: (accountId: string) => Promise<SessionModel[]>
}
