import { DbShowAccount } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeDbShowAccount = (): DbShowAccount => {
  return new DbShowAccount(RepositoryFactory.getAccountRepository(EnvConfig.repositoryType))
}
