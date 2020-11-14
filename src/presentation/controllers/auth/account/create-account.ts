import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { badRequest, serverError } from '@/presentation/helpers'

export class CreateAccountController implements Controller {
  constructor (
    private readonly createAccountValidations: ValidationComposite
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationErrors = this.createAccountValidations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
