import { DbShowSessionByAccessToken } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { CacheFactory } from '@/infra/cache'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbShowSessionByAccessToken = (): DbShowSessionByAccessToken => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbShowSessionByAccessToken(encrypterAdapter, sessionRepository, cacheAdapter, cacheAdapter)
}
