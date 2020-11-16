import { badRequest } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'

export class ActiveAccountController implements Controller {
  constructor (private readonly validations: ValidationComposite) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const validationErrors = this.validations.validate(request.body)
    if (validationErrors) {
      return badRequest(validationErrors)
    }
    return null
  }
}
