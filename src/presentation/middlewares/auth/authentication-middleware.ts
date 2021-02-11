import { Middleware, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowSessionByAccessTokenUseCase } from '@/domain/usecases/auth/session'
import { ShowAccountUseCase } from '@/domain/usecases/auth/account'
import { SessionType } from '@/domain/models/auth'
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
    private readonly tokenName: string,
    private readonly showSessionByAccessToken: ShowSessionByAccessTokenUseCase,
    private readonly showAccount: ShowAccountUseCase
  ) {}

  async handle (request: HttpRequest<any>): Promise<HttpResponse<AuthenticationMiddlewareReponse | Error>> {
    try {
      if ((!request.headers) || (!request.headers[this.tokenName])) {
        return badRequest(new MissingParamError(this.tokenName))
      }
      const accessToken = request.headers[this.tokenName]
      const session = await this.showSessionByAccessToken.show({ accessToken })
      if ((session) && (session.type === SessionType.authentication) && (new Date(session.experied_at) > new Date())) {
        const account = await this.showAccount.show({
          accountId: session.account_id
        })
        if (account) {
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
