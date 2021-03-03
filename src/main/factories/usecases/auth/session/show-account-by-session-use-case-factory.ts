import { ShowAccountBySessionUseCase } from '@/domain/usecases/auth/session'
import { DbShowAccountBySessionUseCase } from '@/data/usecases/auth/session'
import { JWTEncrypterAdapter } from '@/infra/criptografy'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/environment'

export const makeShowAccountBySessionUseCase = (): ShowAccountBySessionUseCase => {
  const encrypterAdapter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  const sessionRepository = RepositoryFactory.getSessionRepository(EnvConfig.repositoryType)
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbShowAccountBySessionUseCase(encrypterAdapter, sessionRepository, accountRepository)
}
