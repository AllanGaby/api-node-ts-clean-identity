import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { badRequest, serverError } from '@/presentation/helpers'
import { CreateAccount } from '@/domain/usecases/auth/account'

export class CreateAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly createAccount: CreateAccount
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const { name, email, password } = request.body
      await this.createAccount.create({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
