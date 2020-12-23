import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowSessionByAccessToken } from '@/main/factories/usecases/auth/session'
import { AccountType } from '@/domain/models/auth'
import { makeDbShowAccount } from '../../usecases/auth/account'

export const makeManagerAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeDbShowSessionByAccessToken(), makeDbShowAccount(), [AccountType.manager])
}
