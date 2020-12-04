import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { GetFilenameToAccountAvatar } from '@/domain/usecases/auth/account'
import { serverError, ok } from '@/presentation/helpers'
import path from 'path'

export interface ShowAvatarAccountRequest {
  account: {
    id: string
  }
}

export class ShowAvatarAccountBySessionController implements Controller<ShowAvatarAccountRequest, string | Error> {
  constructor (
    private readonly getFilenameToAccountAvatar: GetFilenameToAccountAvatar,
    private readonly uploadDir: string
  ) {}

  async handle (request: HttpRequest<ShowAvatarAccountRequest>): Promise<HttpResponse<string | Error>> {
    try {
      const avatarFileName = await this.getFilenameToAccountAvatar.getPath({ accountId: request.body.account.id })
      return ok(`${this.uploadDir}${path.sep}${avatarFileName}`)
    } catch (error) {
      return serverError(error)
    }
  }
}
