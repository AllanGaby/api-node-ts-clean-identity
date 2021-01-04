import { DbShowAccountBySession } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeDbShowAccountBySession = (): DbShowAccountBySession => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbShowAccountBySession(encrypterAdapter, sessionRepository, accountRepository)
}
