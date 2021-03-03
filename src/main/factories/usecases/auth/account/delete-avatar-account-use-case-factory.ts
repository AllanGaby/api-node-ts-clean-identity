import { DeleteAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { DbDeleteAvatarAccountUseCase } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { makeDeleteFileUseCase } from '@/main/factories/usecases/files'
import { CacheFactory } from '@/infra/cache'
import { EnvConfig } from '@/main/config/environment'

export const makeDeleteAvatarAccountUseCase = (): DeleteAvatarAccountUseCase => {
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbDeleteAvatarAccountUseCase(
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    makeDeleteFileUseCase(EnvConfig.uploadAvatarDir),
    RepositoryFactory.getAccountRepository(EnvConfig.repositoryType),
    cacheAdapter
  )
}
