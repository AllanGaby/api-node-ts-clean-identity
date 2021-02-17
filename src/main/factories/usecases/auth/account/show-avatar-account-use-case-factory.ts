import { ShowAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbShowAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeShowAvatarAccountUseCase = (): ShowAvatarAccountUseCase => {
  return new DbShowAvatarAccountUseCase(
    RepositoryFactory.getFileRepository(EnvConfig.repositoryType),
    `${EnvConfig.uploadAvatarDir}/default.png`)
}
