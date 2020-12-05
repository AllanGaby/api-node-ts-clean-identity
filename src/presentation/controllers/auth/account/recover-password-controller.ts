import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { RecoverPassword } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { InvalidCredentialsError } from '@/data/errors'

export interface RecoverPasswordRequest {
  session_id: string
  password: string
  password_confirmation
}

export class RecoverPasswordController implements Controller<RecoverPasswordRequest, AccountModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly recoverPassword: RecoverPassword
  ) {}

  async handle (request: HttpRequest<RecoverPasswordRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.recoverPassword.recover({
        sessionId: request.body.session_id,
        password: request.body.password
      })
      return ok(account)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
