import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ListAccount, ListAccountFilter } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { ok, serverError } from '@/presentation/helpers'

export class ListAccountController implements Controller {
  constructor (private readonly listAccount: ListAccount) {}

  async handle (request: HttpRequest<ListAccountFilter>): Promise<HttpResponse<AccountModel[] | Error>> {
    try {
      const accounts = await this.listAccount.list(request.body)
      return ok(accounts)
    } catch (error) {
      return serverError(error)
    }
  }
}
