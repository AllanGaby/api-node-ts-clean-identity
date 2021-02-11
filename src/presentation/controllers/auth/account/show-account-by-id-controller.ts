import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { ShowAccountUseCase } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'

export interface ShowAccountByIdRequest {
  account_id: string
}

export class ShowAccountByIdController implements Controller<ShowAccountByIdRequest, AccountModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly showAccount: ShowAccountUseCase
  ) {}

  async handle (request: HttpRequest<ShowAccountByIdRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.params)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.showAccount.show({ accountId: request.params.account_id })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
