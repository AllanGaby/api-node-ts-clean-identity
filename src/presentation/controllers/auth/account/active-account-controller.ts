import { badRequest, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { ActiveAccountUseCase } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { InvalidCredentialsError } from '@/data/errors'

export interface ActiveAccountRequest {
  session_id: string
}

export class ActiveAccountController implements Controller<any, AccountModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly activeAccount: ActiveAccountUseCase
  ) {}

  async handle (request: HttpRequest<any>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.params)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const activatedAccount = await this.activeAccount.active({ sessionId: request.params.session_id })
      return ok(activatedAccount)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
