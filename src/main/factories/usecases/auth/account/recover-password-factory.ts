import { DbRecoverPassword } from '@/data/usecases/auth/account/recover-password'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'
import { EnvConfig } from '@/main/config/env'

export const makeDbRecoverPassword = (): DbRecoverPassword => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const hasher = new BCrypterHasherAdapter(12)
  return new DbRecoverPassword(
    sessionRepository,
    accountRepository,
    hasher,
    accountRepository,
    sessionRepository)
}
