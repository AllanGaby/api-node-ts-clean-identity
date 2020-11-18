import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { ShowAccount, ShowAccountFilter } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'

export class ShowAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly showAccount: ShowAccount
  ) {}

  async handle (request: HttpRequest<ShowAccountFilter>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.showAccount.show(request.body)
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
