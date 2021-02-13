import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { serverError, ok, badRequest } from '@/presentation/helpers'
import { InvalidCredentialsError } from '@/data/errors'
import { FileModel } from '@/domain/models/files'
import { ValidationComposite } from '@/validation/validations'

export interface ShowAvatarAccountRequest {
  file_id: string
}

export class ShowAvatarAccountController implements Controller<ShowAvatarAccountRequest, FileModel | Error> {
  constructor (
    private readonly validations: ValidationComposite,
    private readonly showAvatarAccount: ShowAvatarAccountUseCase
  ) {}

  async handle (request: HttpRequest<ShowAvatarAccountRequest>): Promise<HttpResponse<FileModel | Error>> {
    try {
      const validationErrors = this.validations.validate(request.params)
      if (validationErrors) {
        return badRequest(validationErrors)
      }
      const avatarFile = await this.showAvatarAccount.show({ fileId: request.params.file_id })
      return ok(avatarFile)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
