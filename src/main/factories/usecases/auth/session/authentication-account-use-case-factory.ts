import { AuthenticationAccountUseCase } from '@/domain/usecases/auth/session'
import { DbAuthenticationAccountUseCase } from '@/data/usecases/auth/session'
import { CacheFactory } from '@/infra/cache'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/environment'

export const makeAuthenticationAccountUseCase = (): AuthenticationAccountUseCase => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType, EnvConfig.cacheConfig)
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  return new DbAuthenticationAccountUseCase(cacheAdapter, accountRepository, hasherAdapter, cacheAdapter, sessionRepository, encrypter)
}
