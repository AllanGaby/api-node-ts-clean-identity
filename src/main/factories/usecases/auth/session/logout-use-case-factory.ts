import { LogoutUseCase } from '@/domain/usecases/auth/session'
import { DbLogoutUseCase } from '@/data/usecases/auth/session'
import { EnvConfig } from '@/main/config/env'
import { CacheFactory } from '@/infra/cache'
import { RepositoryFactory } from '@/infra/db'

export const makeLogoutUseCase = (): LogoutUseCase => {
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbLogoutUseCase(sessionRepository, sessionRepository, cacheAdapter, cacheAdapter)
}
