import { DbRequestRecoverPassword } from '@/data/usecases/auth/account'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/session'

export const makeDbRequestRecoverPassword = (): DbRequestRecoverPassword => {
  const accountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  return new DbRequestRecoverPassword(
    accountRepository,
    makeDbSendMailSession(),
    'src/infra/comunication/views/handlebars/auth/recover-password.hbs')
}
