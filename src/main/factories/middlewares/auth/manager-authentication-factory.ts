import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowAccountBySession } from '@/main/factories/usecases/auth/memory/session'
import { AccountType } from '@/domain/models/auth'

export const makeManagerAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeDbShowAccountBySession(), [AccountType.manager])
}
