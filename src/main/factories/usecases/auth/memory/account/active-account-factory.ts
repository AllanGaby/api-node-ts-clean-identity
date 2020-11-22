import { DbActiveAccount } from '@/data/usecases/auth/account'
import { MemorySessionRepository, MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbActiveAccount = (): DbActiveAccount => {
  const sessionRepository = new MemorySessionRepository()
  const accountRepository = new MemoryAccountRepository()
  return new DbActiveAccount(sessionRepository, accountRepository, accountRepository, sessionRepository)
}
