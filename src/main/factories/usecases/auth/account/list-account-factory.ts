import { DbListAccount } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbListAccount = (): DbListAccount => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  return new DbListAccount(authRepositoriesFactory.getAccountRepository())
}
