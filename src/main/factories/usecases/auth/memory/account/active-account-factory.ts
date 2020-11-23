import { DbActiveAccount } from '@/data/usecases/auth/account'
import { MemorySessionRepository, MemoryAccountRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbActiveAccount = (): DbActiveAccount => {
  const sessionRepository = MemorySessionRepository.getInstance()
  const accountRepository = MemoryAccountRepository.getInstance()
  return new DbActiveAccount(sessionRepository, accountRepository, accountRepository, sessionRepository)
}
