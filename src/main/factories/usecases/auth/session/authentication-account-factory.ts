import { DbAuthenticationAccount } from '@/data/usecases/auth/session'
import { CacheFactory } from '@/infra/cache'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeDbAuthenticationAccount = (): DbAuthenticationAccount => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  return new DbAuthenticationAccount(accountRepository, hasherAdapter, cacheAdapter, sessionRepository, encrypter)
}
