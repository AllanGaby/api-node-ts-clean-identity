import { CreateAccountUseCase } from '@/domain/usecases/auth/account'
import { DbCreateAccountUseCase } from '@/data/usecases/auth/account'
import { BCrypterHasherAdapter } from '@/infra/criptografy'
import { makeSendMailSessionUseCase } from '@/main/factories/usecases/auth/session'
import { EnvConfig } from '@/main/config/environment'
import { RepositoryFactory } from '@/infra/db'

export const makeCreateAccountUseCase = (): CreateAccountUseCase => {
  const sendMailSession = makeSendMailSessionUseCase()
  const acccountRepository = RepositoryFactory.getAccountRepository(EnvConfig.repositoryType)
  const hasherAdapter = new BCrypterHasherAdapter(12)
  return new DbCreateAccountUseCase(
    acccountRepository,
    hasherAdapter,
    acccountRepository,
    sendMailSession,
    `${EnvConfig.baseDir}/infra/comunication/views/handlebars/auth/create-account.hbs`)
}
