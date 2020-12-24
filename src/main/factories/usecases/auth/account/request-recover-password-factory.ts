import { DbRequestRecoverPassword } from '@/data/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/session'

export const makeDbRequestRecoverPassword = (): DbRequestRecoverPassword => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  return new DbRequestRecoverPassword(
    accountRepository,
    makeDbSendMailSession(),
    'src/infra/comunication/views/handlebars/auth/recover-password.hbs')
}
