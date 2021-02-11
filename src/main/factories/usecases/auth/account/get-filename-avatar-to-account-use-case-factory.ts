import { GetFilenameToAccountAvatarUseCase } from '@/domain/usecases/auth/account'
import { DbGetFilenameToAccountAvatarUseCase } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeGetFilenameToAccountAvatarUseCase = (): GetFilenameToAccountAvatarUseCase => {
  return new DbGetFilenameToAccountAvatarUseCase(RepositoryFactory.getAccountRepository(EnvConfig.repositoryType))
}
