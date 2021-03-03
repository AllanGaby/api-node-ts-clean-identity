import { UploadAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbUploadAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { makeUploadFileUseCase, makeDeleteFileUseCase } from '@/main/factories/usecases/files'
import { CacheFactory } from '@/infra/cache'
import { EnvConfig } from '@/main/config/environment'

export const makeUploadAvatarAccountUseCase = (): UploadAvatarAccountUseCase => {
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbUploadAvatarAccountUseCase(
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    makeDeleteFileUseCase(EnvConfig.uploadAvatarDir),
    makeUploadFileUseCase(EnvConfig.uploadAvatarDir),
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    cacheAdapter
  )
}
