import { DbRecoverPassword } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeDbRecoverPassword = (): DbRecoverPassword => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const hasher = new BCrypterHasherAdapter(12)
  return new DbRecoverPassword(
    sessionRepository,
    accountRepository,
    hasher,
    accountRepository,
    sessionRepository)
}
