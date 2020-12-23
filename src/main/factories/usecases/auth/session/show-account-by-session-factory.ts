import { DbShowAccountBySession } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'

export const makeDbShowAccountBySession = (): DbShowAccountBySession => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = MemorySessionRepository.getInstance()
  const accountRepository = MemoryAccountRepository.getInstance()
  return new DbShowAccountBySession(encrypterAdapter, sessionRepository, accountRepository)
}
