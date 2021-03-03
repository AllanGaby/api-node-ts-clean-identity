import { RecoverPasswordUseCase } from '@/domain/usecases/auth/account'
import { DbRecoverPasswordUseCase } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/environment'
import { RepositoryFactory } from '@/infra/db'

export const makeRecoverPasswordUseCase = (): RecoverPasswordUseCase => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const hasher = new BCrypterHasherAdapter(12)
  return new DbRecoverPasswordUseCase(
    sessionRepository,
    accountRepository,
    hasher,
    accountRepository,
    sessionRepository)
}
