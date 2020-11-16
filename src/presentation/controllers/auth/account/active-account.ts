import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'

export class ActiveAccountController implements Controller {
  constructor (private readonly validations: ValidationComposite) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    this.validations.validate(request.body)
    return null
  }
}
