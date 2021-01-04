import { DbGetFilenameToAccountAvatar } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeDbGetFilenameToAccountAvatar = (): DbGetFilenameToAccountAvatar => {
  return new DbGetFilenameToAccountAvatar(RepositoryFactory.getAccountRepository(EnvConfig.repositoryType))
}
