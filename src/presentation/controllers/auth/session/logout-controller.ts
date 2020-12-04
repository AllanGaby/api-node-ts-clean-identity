import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Logout } from '@/domain/usecases/auth/session'
import { serverError, noContent, forbidden } from '@/presentation/helpers'
import { InvalidCredentialsError } from '@/data/errors'

export interface LogoutRequest {
  session: {
    sessionId: string
  }
}

export class LogoutController implements Controller<LogoutRequest, any | Error> {
  constructor (
    private readonly logout: Logout
  ) {}

  async handle (request: HttpRequest<LogoutRequest>): Promise<HttpResponse<any | Error>> {
    try {
      await this.logout.logout({ sessionId: request.body.session.sessionId })
      return noContent()
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return forbidden(new InvalidCredentialsError())
      }
      return serverError(error)
    }
  }
}
