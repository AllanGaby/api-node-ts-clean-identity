import { DbAuthenticationAccount } from '@/data/usecases/auth/session'
import { MemoryAccountRepository, MemorySessionRepository } from '@/infra/db/memory/repositories/auth'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'

export const makeDbAuthenticationAccount = (): DbAuthenticationAccount => {
  const accountRepository = MemoryAccountRepository.getInstance()
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const sessionRepository = MemorySessionRepository.getInstance()
  const encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  return new DbAuthenticationAccount(accountRepository, hasherAdapter, sessionRepository, encrypter)
}
