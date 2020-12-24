import { DbSetAccountType } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbSetAccountType = (): DbSetAccountType => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  return new DbSetAccountType(accountRepository, accountRepository)
}
