import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowAccountBySession } from '@/main/factories/usecases/auth/memory/session'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeDbShowAccountBySession())
}
