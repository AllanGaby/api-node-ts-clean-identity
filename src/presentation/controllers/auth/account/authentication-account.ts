import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { AuthenticationAccount, AuthenticationAccountDTO } from '@/domain/usecases/auth/account'
import { AuthenticationModel } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'

export class AuthenticationAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly authenticationAccount: AuthenticationAccount
  ) {}

  async handle (request: HttpRequest<AuthenticationAccountDTO>): Promise<HttpResponse<AuthenticationModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const { email, password } = request.body
      const authentication = await this.authenticationAccount.authenticate({
        email,
        password
      })
      return ok(authentication)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return unauthorized(error)
      }
      return serverError(error)
    }
  }
}
