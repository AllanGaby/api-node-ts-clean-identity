import { GetAccountByEmail } from '@/data/protocols/repository/auth/account'
import { AccountModel } from '@/domain/models/auth'

export class GetAccountByEmailRepositorySpy implements GetAccountByEmail {
  searchMail: string
  account: AccountModel

  async getAccountByEmail (email: string): Promise<AccountModel> {
    this.searchMail = email
    return this.account
  }
}
