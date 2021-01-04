import { DbShowSessionByAccessToken } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { CacheFactory } from '@/infra/cache'
import { RepositoryFactory } from '@/infra/db'

export const makeDbShowSessionByAccessToken = (): DbShowSessionByAccessToken => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbShowSessionByAccessToken(encrypterAdapter, sessionRepository, cacheAdapter, cacheAdapter)
}
