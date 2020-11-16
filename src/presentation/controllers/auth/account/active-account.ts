import { badRequest, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { ActiveAccount } from '@/domain/usecases/auth/account'

export class ActiveAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly activeAccount: ActiveAccount
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const { sessionId } = request.body
      await this.activeAccount.active({ sessionId })
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
