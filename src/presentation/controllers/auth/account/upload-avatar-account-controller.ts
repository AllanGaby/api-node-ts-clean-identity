import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validations'
import { UploadAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { badRequest, serverError, ok } from '@/presentation/helpers'

export interface UploadAvatarAccountRequest {
  avatar_file_path?: string
  session: {
    accountId: string
  }
}

export class UploadAvatarAccountController implements Controller<UploadAvatarAccountRequest, AccountModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly uploadAvatarAccount: UploadAvatarAccountUseCase
  ) {}

  async handle (request: HttpRequest<UploadAvatarAccountRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.body)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const account = await this.uploadAvatarAccount.upload({
        accountId: request.body.session.accountId,
        avatarFilePath: request.body.avatar_file_path
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
