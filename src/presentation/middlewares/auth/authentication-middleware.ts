import { Middleware, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowSessionByAccessToken } from '@/domain/usecases/auth/session'
import { ShowAccount } from '@/domain/usecases/auth/account'
import { AccountType, SessionType } from '@/domain/models/auth'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers'
import { MissingParamError } from '@/validation/errors'
import { AccessDeniedError } from '@/presentation/errors'

export interface AuthenticationMiddlewareReponse {
  accountId: string
  sessionId: string
}

export class AuthenticationMiddleware implements Middleware<any, AuthenticationMiddlewareReponse | Error> {
  constructor (
    private readonly showSessionByAccessToken: ShowSessionByAccessToken,
    private readonly showAccount: ShowAccount,
    private readonly accountType: AccountType[] = null
  ) {}

  async handle (request: HttpRequest<any>): Promise<HttpResponse<AuthenticationMiddlewareReponse | Error>> {
    try {
      const accessToken = request.headers?.['x-access-token']
      if (!accessToken) {
        return badRequest(new MissingParamError('x-access-token'))
      }
      const session = await this.showSessionByAccessToken.show({ accessToken })
      if ((session) && (session.type === SessionType.authentication)) {
        const account = await this.showAccount.show({
          accountId: session.account_id
        })
        if ((account) && ((!this.accountType) || (this.accountType.includes(account.type)))) {
          return ok({
            accountId: account.id,
            sessionId: session.id
          })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
