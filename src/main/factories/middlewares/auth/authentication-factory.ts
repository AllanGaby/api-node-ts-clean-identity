import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowSessionByAccessToken } from '@/main/factories/usecases/auth/memory/session'
import { makeDbShowAccount } from '../../usecases/auth/memory/account'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeDbShowSessionByAccessToken(), makeDbShowAccount())
}
