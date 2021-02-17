import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { serverError, ok, badRequest } from '@/presentation/helpers'
import { InvalidCredentialsError } from '@/data/errors'

export interface ShowAvatarAccountRequest {
  avatar_id: string
}

export class ShowAvatarAccountController implements Controller<ShowAvatarAccountRequest, string | Error> {
  constructor (
    private readonly showAvatarAccount: ShowAvatarAccountUseCase
  ) {}

  async handle (request: HttpRequest<ShowAvatarAccountRequest>): Promise<HttpResponse<string | Error>> {
    try {
      const avatarPath = await this.showAvatarAccount.show({ fileId: request.params.avatar_id })
      return ok(avatarPath)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
