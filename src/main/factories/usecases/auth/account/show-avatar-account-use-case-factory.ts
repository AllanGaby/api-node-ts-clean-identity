import { ShowAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbShowAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/environment'

export const makeShowAvatarAccountUseCase = (): ShowAvatarAccountUseCase => {
  return new DbShowAvatarAccountUseCase(
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    RepositoryFactory.getFileRepository(EnvConfig.repositoryType),
    `${EnvConfig.uploadAvatarDir}/default.png`)
}
