import { GetAccountByEmailRepository, CreateAccountRepository, CreateAccountModel, UpdateAccountRepository, ListAccountRepository } from '@/data/repositories/auth/account'
import { ListAccountFilter } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account/get-account-by-id'
import { AccountModel } from '@/domain/models/auth'
import { mockAccountModel } from './mock-account'

export class GetAccountByEmailRepositorySpy implements GetAccountByEmailRepository {
  searchMail: string
  account: AccountModel

  async getAccountByEmail (email: string): Promise<AccountModel> {
    this.searchMail = email
    return this.account
  }
}

export class GetAccountByIdRepositorySpy implements GetAccountByIdRepository {
  accountId: string
  account: AccountModel = mockAccountModel()

  async getAccountById (accountId: string): Promise<AccountModel> {
    this.accountId = accountId
    return this.account
  }
}

export class CreateAccountRepositorySpy implements CreateAccountRepository {
  addAccountParams: CreateAccountModel
  account: AccountModel = mockAccountModel()

  async add (data: CreateAccountModel): Promise<AccountModel> {
    this.addAccountParams = data
    return this.account
  }
}

export class UpdateAccountRepositorySpy implements UpdateAccountRepository {
  account: AccountModel

  async update (account: AccountModel): Promise<AccountModel> {
    this.account = account
    return this.account
  }
}

export class ListAccountRepositorySpy implements ListAccountRepository {
  filter: ListAccountFilter
  listAccount: AccountModel[]

  async list (filter: ListAccountFilter): Promise<AccountModel[]> {
    this.filter = filter
    return this.listAccount
  }
}
