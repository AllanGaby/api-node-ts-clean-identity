import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ListAccount, ListAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { ok, serverError } from '@/presentation/helpers'

export class ListAccountController implements Controller<ListAccountDTO, AccountModel[] | Error> {
  constructor (private readonly listAccount: ListAccount) {}

  async handle (request: HttpRequest<ListAccountDTO>): Promise<HttpResponse<AccountModel[] | Error>> {
    try {
      const accounts = await this.listAccount.list(request.body)
      return ok(accounts)
    } catch (error) {
      return serverError(error)
    }
  }
}
