import { DbLogout } from '@/data/usecases/auth/session'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbLogout = (): DbLogout => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  return new DbLogout(sessionRepository, sessionRepository)
}
