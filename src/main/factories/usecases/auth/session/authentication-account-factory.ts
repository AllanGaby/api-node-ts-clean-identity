import { DbAuthenticationAccount } from '@/data/usecases/auth/session'
import { BCrypterHasherAdapter, JWTEncrypterAdapter } from '@/infra/criptografy'
import { EnvConfig } from '@/main/config/env'
import { AuthRepositoriesFactory } from '@/main/factories/repositories'

export const makeDbAuthenticationAccount = (): DbAuthenticationAccount => {
  const authRepositoriesFactory = new AuthRepositoriesFactory(EnvConfig.repositoryType)
  const accountRepository = authRepositoriesFactory.getAccountRepository()
  const sessionRepository = authRepositoriesFactory.getSessionRepository()
  const hasherAdapter = new BCrypterHasherAdapter(12)
  const encrypter = new JWTEncrypterAdapter(EnvConfig.jwtSecret, 1)
  return new DbAuthenticationAccount(accountRepository, hasherAdapter, sessionRepository, encrypter)
}
