import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { RequestRecoverPassword, RequestRecoverPasswordDTO } from '@/domain/usecases/auth/account'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { SessionModel } from '@/domain/models/auth'
import { AccountNotFoundError } from '@/data/errors'

export class RequestRecoverPasswordController implements Controller<RequestRecoverPasswordDTO, SessionModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly requestRecoverPassword: RequestRecoverPassword
  ) {}

  async handle (request: HttpRequest<RequestRecoverPasswordDTO>): Promise<HttpResponse<SessionModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const requestRecover = await this.requestRecoverPassword.request(request.body)
      return ok(requestRecover)
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
