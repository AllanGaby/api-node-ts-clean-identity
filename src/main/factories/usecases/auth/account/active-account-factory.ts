import { DbActiveAccount } from '@/data/usecases/auth/account'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'
import { EnvConfig } from '@/main/config/env'

export const makeDbActiveAccount = (): DbActiveAccount => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  return new DbActiveAccount(sessionRepository, accountRepository, accountRepository, sessionRepository)
}
