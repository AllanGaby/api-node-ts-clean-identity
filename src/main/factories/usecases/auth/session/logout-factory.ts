import { DbLogout } from '@/data/usecases/auth/session'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'
import { MemoryCacheAdapter } from '@/infra/cache'

export const makeDbLogout = (): DbLogout => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const cacheAdapter = new MemoryCacheAdapter()
  return new DbLogout(sessionRepository, sessionRepository, cacheAdapter, cacheAdapter)
}
