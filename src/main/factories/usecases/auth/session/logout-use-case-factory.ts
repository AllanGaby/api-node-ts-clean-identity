import { DbLogout } from '@/data/usecases/auth/session'
import { EnvConfig } from '@/main/config/env'
import { CacheFactory } from '@/infra/cache'
import { RepositoryFactory } from '@/infra/db'

export const makeDbLogout = (): DbLogout => {
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbLogout(sessionRepository, sessionRepository, cacheAdapter, cacheAdapter)
}
