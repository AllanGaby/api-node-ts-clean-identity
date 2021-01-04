import { DbActiveAccount } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeDbActiveAccount = (): DbActiveAccount => {
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbActiveAccount(sessionRepository, accountRepository, accountRepository, sessionRepository)
}
