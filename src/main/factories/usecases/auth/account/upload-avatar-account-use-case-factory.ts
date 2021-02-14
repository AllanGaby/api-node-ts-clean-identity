import { UploadAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbUploadAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'
import { makeUploadFileUseCase, makeDeleteFileUseCase } from '@/main/factories/usecases/files'
import { CacheFactory } from '@/infra/cache'

export const makeUploadAvatarAccountUseCase = (): UploadAvatarAccountUseCase => {
  const uploadDir = 'uploads/auth/avatar/'
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbUploadAvatarAccountUseCase(
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    makeDeleteFileUseCase(uploadDir),
    makeUploadFileUseCase(uploadDir),
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    cacheAdapter
  )
}
