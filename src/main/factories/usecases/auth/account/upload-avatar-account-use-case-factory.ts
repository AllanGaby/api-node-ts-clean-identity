import { UploadAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbUploadAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'
import { makeUploadFileUseCase } from '../../files'

export const makeUploadAvatarAccountUseCase = (): UploadAvatarAccountUseCase => {
  return new DbUploadAvatarAccountUseCase(
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    makeUploadFileUseCase('uploads/auth/avatar/'),
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  )
}
