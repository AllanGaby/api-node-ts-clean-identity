import { DbShowAccount } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbShowAccount = (): DbShowAccount => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  return new DbShowAccount(authRepositoriesFactory.getAccountRepository())
}
