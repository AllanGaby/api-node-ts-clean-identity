import { UploadAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbUploadAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'
import { makeUploadFileUseCase, makeDeleteFileUseCase } from '@/main/factories/usecases/files'

export const makeUploadAvatarAccountUseCase = (): UploadAvatarAccountUseCase => {
  const uploadDir = 'uploads/auth/avatar/'
  return new DbUploadAvatarAccountUseCase(
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    makeDeleteFileUseCase(uploadDir),
    makeUploadFileUseCase(uploadDir),
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  )
}
