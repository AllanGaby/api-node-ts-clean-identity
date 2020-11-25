import { DbRecoverPassword } from '@/data/usecases/auth/account/recover-password'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter } from '@/infra/criptografy'

export const makeDbRecoverPassword = (): DbRecoverPassword => {
  const accountRepository = MemoryAccountRepository.getInstance()
  const sessionRepository = MemorySessionRepository.getInstance()
  const hasher = new BCrypterHasherAdapter(12)
  return new DbRecoverPassword(
    sessionRepository,
    accountRepository,
    hasher,
    accountRepository)
}
