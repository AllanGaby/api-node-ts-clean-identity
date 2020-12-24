import { DbUpdateAccount } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeDbSendMailSession } from '@/main/factories/usecases/auth/session'
import { LocalStorage } from '@/infra/storage'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbUpdateAccount = (): DbUpdateAccount => {
  const sendMailSession = makeDbSendMailSession()
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const acccountRepository = authRepositoriesFactory.getAccountRepository()
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const localStorage = new LocalStorage({
    temporaryDir: 'temp',
    uploadDir: 'uploads'
  })
  return new DbUpdateAccount(
    acccountRepository,
    hasherAdapter,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`,
    localStorage,
    sessionRepository)
}
