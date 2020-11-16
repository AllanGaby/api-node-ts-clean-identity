import { badRequest, serverError, unauthorized } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { AuthenticationAccount } from '@/domain/usecases/auth/account'
import { InvalidCredentialsError } from '@/data/errors'

export class AuthenticationAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly authenticationAccount: AuthenticationAccount
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const { email, password } = request.body
      await this.authenticationAccount.authenticate({
        email,
        password
      })
      return null
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return unauthorized(error)
      }
      return serverError(error)
    }
  }
}
