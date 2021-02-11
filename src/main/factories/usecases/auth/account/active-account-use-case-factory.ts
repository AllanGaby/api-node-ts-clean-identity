import { ActiveAccountUseCase } from '@/domain/usecases/auth/account'
import { DbActiveAccountUseCase } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeActiveAccountUseCase = (): ActiveAccountUseCase => {
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbActiveAccountUseCase(sessionRepository, accountRepository, accountRepository, sessionRepository)
}
