import { UpdateAccountUseCase } from '@/domain/usecases/auth/account'
import { DbUpdateAccountUseCase } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeSendMailSessionUseCase } from '@/main/factories/usecases/auth/session'
import { EnvConfig } from '@/main/config/environment'
import { RepositoryFactory } from '@/infra/db'
import { CacheFactory } from '@/infra/cache'

export const makeUpdateAccountUseCase = (): UpdateAccountUseCase => {
  const sendMailSession = makeSendMailSessionUseCase()
  const acccountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbUpdateAccountUseCase(
    acccountRepository,
    hasherAdapter,
    hasherAdapter,
    sessionRepository,
    cacheAdapter,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`,
    cacheAdapter)
}
