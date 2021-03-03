import { ShowAccountUseCase } from '@/domain/usecases/auth/account'
import { DbShowAccountUseCase } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/environment'

export const makeShowAccountUseCase = (): ShowAccountUseCase => {
  return new DbShowAccountUseCase(RepositoryFactory.getAccountRepository(EnvConfig.repositoryType))
}
