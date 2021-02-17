import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { DeleteAvatarAccountUseCase } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { serverError, ok } from '@/presentation/helpers'

export interface DeleteAvatarAccountRequest {
  session: {
    accountId: string
  }
}

export class DeleteAvatarAccountController implements Controller<DeleteAvatarAccountRequest, AccountModel | Error> {
  constructor (
    private readonly deleteAvatarAccount: DeleteAvatarAccountUseCase
  ) {}

  async handle (request: HttpRequest<DeleteAvatarAccountRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const account = await this.deleteAvatarAccount.delete({
        accountId: request.body.session.accountId
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
