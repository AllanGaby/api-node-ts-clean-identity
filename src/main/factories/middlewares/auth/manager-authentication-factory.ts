import { AuthenticationMiddleware } from '@/presentation/middlewares/auth'
import { makeDbShowSessionByAccessToken } from '@/main/factories/usecases/auth/memory/session'
import { AccountType } from '@/domain/models/auth'
import { makeDbShowAccount } from '../../usecases/auth/memory/account'

export const makeManagerAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeDbShowSessionByAccessToken(), makeDbShowAccount(), [AccountType.manager])
}
