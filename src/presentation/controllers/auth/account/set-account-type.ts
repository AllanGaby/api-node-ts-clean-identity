import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { SetAccountType } from '@/domain/usecases/auth/account'
import { AccountModel, AccountType } from '@/domain/models/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'

export interface SetAccountTypeRequest {
  account_id: string
  account_type: AccountType
}

export class SetAccountTypeController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly setAccountType: SetAccountType
  ) {}

  async handle (request: HttpRequest<SetAccountTypeRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.setAccountType.setAccountType({
        accountId: request.body.account_id,
        accountType: request.body.account_type
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
