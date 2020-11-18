import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { SetAccountType, SetAccountTypeDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'

export class SetAccountTypeController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly setAccountType: SetAccountType
  ) {}

  async handle (request: HttpRequest<SetAccountTypeDTO>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.setAccountType.setAccountType(request.body)
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
