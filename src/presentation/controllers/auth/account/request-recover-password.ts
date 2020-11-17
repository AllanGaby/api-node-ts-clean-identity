import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { RequestRecoverPassword, RequestRecoverPasswordDTO } from '@/domain/usecases/auth/account'
import { badRequest, serverError } from '@/presentation/helpers'

export class RequestRecoverPasswordController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly requestRecoverPassword: RequestRecoverPassword
  ) {}

  async handle (request: HttpRequest<RequestRecoverPasswordDTO>): Promise<HttpResponse<boolean | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
