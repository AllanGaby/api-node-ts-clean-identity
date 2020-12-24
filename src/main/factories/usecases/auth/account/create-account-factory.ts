import { DbCreateAccount } from '@/data/usecases/auth/account'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/session'
import { EnvConfig } from '@/main/config/env'

export const makeDbCreateAccount = (): DbCreateAccount => {
  const sendMailSession = makeDbSendMailSession()
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const acccountRepository = authRepositoriesFactory.getAccountRepository()
  const hasherAdapter = new BCrypterHasherAdapter(12)
  return new DbCreateAccount(
    acccountRepository,
    hasherAdapter,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`)
}
