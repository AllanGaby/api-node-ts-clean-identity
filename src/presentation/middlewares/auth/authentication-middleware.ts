import { Middleware, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowSessionByAccessToken } from '@/domain/usecases/auth/session'
import { ShowAccount } from '@/domain/usecases/auth/account'
import { AccountType, SessionType } from '@/domain/models/auth'
import { badRequest, serverError, ok, forbidden, unauthorized } from '@/presentation/helpers'
import { MissingParamError } from '@/validation/errors'
import { AccessDeniedError } from '@/presentation/errors'
import { TokenExpiredError } from 'jsonwebtoken'
import { InvalidCredentialsError } from '@/data/errors'

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
      if ((!request.headers) || (!request.headers['x-access-token'])) {
        return badRequest(new MissingParamError('x-access-token'))
      }
      const accessToken = request.headers['x-access-token']
      const session = await this.showSessionByAccessToken.show({ accessToken })
      if ((session) && (session.type === SessionType.authentication) && (session.experied_at > new Date())) {
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

      return unauthorized(new AccessDeniedError())
    } catch (error) {
      if ((error instanceof TokenExpiredError) || (error instanceof InvalidCredentialsError)) {
        return forbidden(new InvalidCredentialsError())
      }
      return serverError(error)
    }
  }
}
