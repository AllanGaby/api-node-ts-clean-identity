import { DbRequestRecoverPasswordUseCase } from '@/data/usecases/auth/account'
import { RequestRecoverPasswordUseCase } from '@/domain/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/environment'
import { makeSendMailSessionUseCase } from '@/main/factories/usecases/auth/session'

export const makeRequestRecoverPasswordUseCase = (): RequestRecoverPasswordUseCase => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbRequestRecoverPasswordUseCase(
    accountRepository,
    makeSendMailSessionUseCase(),
    'src/infra/comunication/views/handlebars/auth/recover-password.hbs')
}
