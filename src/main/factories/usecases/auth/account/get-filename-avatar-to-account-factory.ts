import { DbGetFilenameToAccountAvatar } from '@/data/usecases/auth/account'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'
import { EnvConfig } from '@/main/config/env'

export const makeDbGetFilenameToAccountAvatar = (): DbGetFilenameToAccountAvatar => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  return new DbGetFilenameToAccountAvatar(accountRepository)
}
