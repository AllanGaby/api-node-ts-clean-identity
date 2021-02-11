import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowSessionByAccessToken } from '@/main/factories/usecases/auth/session'
import { makeDbShowAccount } from '@/main/factories/usecases/auth/account'
import { EnvConfig } from '@/main/config/env'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(EnvConfig.tokenName, makeDbShowSessionByAccessToken(), makeDbShowAccount())
}
