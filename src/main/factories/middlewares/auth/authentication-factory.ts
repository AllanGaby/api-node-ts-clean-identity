import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeShowSessionByAccessTokenUseCase } from '@/main/factories/usecases/auth/session'
import { makeShowAccountUseCase } from '@/main/factories/usecases/auth/account'
import { EnvConfig } from '@/main/config/environment'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(EnvConfig.tokenName, makeShowSessionByAccessTokenUseCase(), makeShowAccountUseCase())
}
