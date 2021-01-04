import { DbListAccount } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeDbListAccount = (): DbListAccount => {
  return new DbListAccount(RepositoryFactory.getAccountRepository(EnvConfig.repositoryType))
}
