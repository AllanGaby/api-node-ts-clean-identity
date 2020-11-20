import { GetAccountByEmailRepository, CreateAccountRepository, CreateAccountModel, UpdateAccountRepository, ListAccountRepository, UpdateAccountModel } from '@/data/repositories/auth/account'
import { ListAccountFilter } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account/get-account-by-id-repository'
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

  async create (data: CreateAccountModel): Promise<AccountModel> {
    this.addAccountParams = data
    return this.account
  }
}

export class UpdateAccountRepositorySpy implements UpdateAccountRepository {
  params: UpdateAccountModel
  account: AccountModel = mockAccountModel()

  async update (params: UpdateAccountModel): Promise<AccountModel> {
    this.params = params
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
