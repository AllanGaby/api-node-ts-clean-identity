import { GetAccountByEmailRepository, CreateAccountRepository, AddAccountModel } from '@/data/repositories/auth/account'
import { AccountModel } from '@/domain/models/auth'

export class GetAccountByEmailRepositorySpy implements GetAccountByEmailRepository {
  searchMail: string
  account: AccountModel

  async getAccountByEmail (email: string): Promise<AccountModel> {
    this.searchMail = email
    return this.account
  }
}

export class CreateAccountRepositorySpy implements CreateAccountRepository {
  addAccountParams: AddAccountModel
  account: AccountModel

  async add (data: AddAccountModel): Promise<AccountModel> {
    this.addAccountParams = data
    return this.account
  }
}
