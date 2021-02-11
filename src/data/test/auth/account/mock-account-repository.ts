import { GetAccountByEmailRepository, CreateAccountRepository, CreateAccountModel, UpdateAccountRepository, UpdateAccountDTO, GetAccountByIdRepository, DeleteSessionByAccountIdRepository } from '@/data/repositories/auth'
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
  params: UpdateAccountDTO
  account: AccountModel = mockAccountModel()

  async update (params: UpdateAccountDTO): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

export class DeleteSessionByAccountIdRepositorySpy implements DeleteSessionByAccountIdRepository {
  accountId: string

  async deleteByAccountId (accountId: string): Promise<void> {
    this.accountId = accountId
  }
}
