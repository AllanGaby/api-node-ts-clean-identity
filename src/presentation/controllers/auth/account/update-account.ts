import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { UpdateAccount } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'

export interface UpdateAccountRequest {
  id: string
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  avatar_file_path?: string
}

export class UpdateAccountController implements Controller<UpdateAccountRequest, AccountModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly updateAccount: UpdateAccount
  ) {}

  async handle (request: HttpRequest<UpdateAccountRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.updateAccount.update({
        id: request.body.id,
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        avatarFilePath: request.body.avatar_file_path
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
