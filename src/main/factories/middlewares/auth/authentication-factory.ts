import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowSessionByAccessToken } from '@/main/factories/usecases/auth/session'
import { makeDbShowAccount } from '@/main/factories/usecases/auth/account'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeDbShowSessionByAccessToken(), makeDbShowAccount())
}
