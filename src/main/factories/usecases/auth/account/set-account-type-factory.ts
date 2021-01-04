import { DbSetAccountType } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeDbSetAccountType = (): DbSetAccountType => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbSetAccountType(accountRepository, accountRepository)
}
