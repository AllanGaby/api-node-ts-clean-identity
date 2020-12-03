import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowAccount } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { serverError, ok } from '@/presentation/helpers'

export interface ShowAccountRequest {
  account: {
    id: string
  }
}

export class ShowAccountBySessionController implements Controller<ShowAccountRequest, AccountModel | Error> {
  constructor (
    private readonly showAccount: ShowAccount
  ) {}

  async handle (request: HttpRequest<ShowAccountRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const account = await this.showAccount.show({ accountId: request.body.account.id })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
