import { DbShowAccountBySession } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbShowAccountBySession = (): DbShowAccountBySession => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  return new DbShowAccountBySession(encrypterAdapter, sessionRepository, accountRepository)
}
