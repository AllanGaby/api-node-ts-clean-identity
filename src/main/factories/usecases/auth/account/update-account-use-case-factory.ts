import { UpdateAccountUseCase } from '@/domain/usecases/auth/account'
import { DbUpdateAccountUseCase } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeSendMailSessionUseCase } from '@/main/factories/usecases/auth/session'
import { LocalStorage } from '@/infra/storage'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'
import { CacheFactory } from '@/infra/cache'

export const makeUpdateAccountUseCase = (): UpdateAccountUseCase => {
  const sendMailSession = makeSendMailSessionUseCase()
  const acccountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const localStorage = new LocalStorage({
    temporaryDir: 'temp',
    uploadDir: 'uploads'
  })
  const cacheAdapter = CacheFactory.getCacheAdapter(EnvConfig.cacheType)
  return new DbUpdateAccountUseCase(
    acccountRepository,
    hasherAdapter,
    sessionRepository,
    cacheAdapter,
    localStorage,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`,
    cacheAdapter)
}
