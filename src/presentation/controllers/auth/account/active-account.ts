import { badRequest, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { ActiveAccount } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'

export interface ActiveAccountRequest {
  sessionId: string
}

export class ActiveAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly activeAccount: ActiveAccount
  ) {}

  async handle (request: HttpRequest<ActiveAccountRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const { sessionId } = request.body
      const activatedAccount = await this.activeAccount.active({ sessionId })
      return ok(activatedAccount)
    } catch (error) {
      return serverError(error)
    }
  }
}
