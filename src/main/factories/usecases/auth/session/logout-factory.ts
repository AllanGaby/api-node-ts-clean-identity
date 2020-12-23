import { DbLogout } from '@/data/usecases/auth/session'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbLogout = (): DbLogout => {
  const sessionRepository = MemorySessionRepository.getInstance()
  return new DbLogout(sessionRepository, sessionRepository)
}
