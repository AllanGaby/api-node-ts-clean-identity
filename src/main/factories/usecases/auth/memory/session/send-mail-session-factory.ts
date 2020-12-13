import { DbSendMailSession } from '@/data/usecases/auth/session'
import { MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { makeDbSendMail } from '@/main/factories/usecases/utils'

export const makeDbSendMailSession = (): DbSendMailSession => {
  const sessionRepository = MemorySessionRepository.getInstance()
  return new DbSendMailSession(sessionRepository, makeDbSendMail())
}
