import { Middleware, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowAccountBySession } from '@/domain/usecases/auth/session'
import { AccountModel, AccountType } from '@/domain/models/auth'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers'
import { MissingParamError } from '@/validation/errors'
import { AccessDeniedError } from '@/presentation/errors'

export class AuthenticationMiddleware implements Middleware<any, AccountModel | Error> {
  constructor (
    private readonly ShowAccountBySession: ShowAccountBySession,
    private readonly accountType: AccountType[]
  ) {}

  async handle (request: HttpRequest<any>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const accessToken = request.headers?.['x-access-token']
      if (!accessToken) {
        return badRequest(new MissingParamError('x-access-token'))
      }
      const account = await this.ShowAccountBySession.show({
        accessToken
      })
      console.log(account)
      console.log(this.accountType)
      if ((account) && (this.accountType.includes(account.type))) {
        return ok(account)
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
