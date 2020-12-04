import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { GetFilenameToAccountAvatar } from '@/domain/usecases/auth/account'
import { serverError, ok } from '@/presentation/helpers'
import { AvatarModel } from '@/domain/models/auth'

export interface ShowAvatarAccountRequest {
  session: {
    accountId: string
  }
}

export class ShowAvatarAccountBySessionController implements Controller<ShowAvatarAccountRequest, AvatarModel | Error> {
  constructor (
    private readonly getFilenameToAccountAvatar: GetFilenameToAccountAvatar,
    private readonly uploadDir: string
  ) {}

  async handle (request: HttpRequest<ShowAvatarAccountRequest>): Promise<HttpResponse<AvatarModel | Error>> {
    try {
      const avatarModel = await this.getFilenameToAccountAvatar.getPath({ accountId: request.body.session.accountId, uploadDir: this.uploadDir })
      return ok(avatarModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
