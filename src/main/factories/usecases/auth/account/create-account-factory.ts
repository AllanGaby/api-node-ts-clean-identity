import { DbCreateAccount } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/session'
import { EnvConfig } from '@/main/config/env'
import { RepositoryFactory } from '@/infra/db'

export const makeDbCreateAccount = (): DbCreateAccount => {
  const sendMailSession = makeDbSendMailSession()
  const acccountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const hasherAdapter = new BCrypterHasherAdapter(12)
  return new DbCreateAccount(
    acccountRepository,
    hasherAdapter,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`)
}
