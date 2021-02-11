import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ShowAccountUseCase } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { serverError, ok } from '@/presentation/helpers'

export interface ShowAccountRequest {
  session: {
    accountId: string
  }
}

export class ShowAccountBySessionController implements Controller<ShowAccountRequest, AccountModel | Error> {
  constructor (
    private readonly showAccount: ShowAccountUseCase
  ) {}

  async handle (request: HttpRequest<ShowAccountRequest>): Promise<HttpResponse<AccountModel | Error>> {
    try {
      const account = await this.showAccount.show({ accountId: request.body.session.accountId })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
