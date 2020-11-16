import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers'
import { CreateAccount } from '@/domain/usecases/auth/account'
import { EmailInUseError } from '@/data/errors'
import { SessionModel } from '@/domain/models/auth'

export interface CreateAccountRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export class CreateAccountController implements Controller {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly createAccount: CreateAccount
  ) {}

  async handle (request: HttpRequest<CreateAccountRequest>): Promise<HttpResponse<SessionModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const { name, email, password } = request.body
      const session = await this.createAccount.create({
        name,
        email,
        password
      })
      return created(session)
    } catch (error) {
      if (error instanceof EmailInUseError) {
        return forbidden(error)
      } else {
        return serverError(error)
      }
    }
  }
}
