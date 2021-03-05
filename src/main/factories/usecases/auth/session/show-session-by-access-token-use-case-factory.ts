import { ShowSessionByAccessTokenUseCase } from '@/domain/usecases/auth/session'
import { DbShowSessionByAccessTokenUseCase } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/environment'
import { CacheFactory } from '@/infra/cache'
import { RepositoryFactory } from '@/infra/db'

export const makeShowSessionByAccessTokenUseCase = (): ShowSessionByAccessTokenUseCase => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType, EnvConfig.cacheConfig)
  return new DbShowSessionByAccessTokenUseCase(encrypterAdapter, sessionRepository, cacheAdapter, cacheAdapter)
}
