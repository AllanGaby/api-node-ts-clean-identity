import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, UpdateAccountModel, ListAccountRepository, ListAccountRepositoryFilter } from '@/data/repositories/auth/account'
import { MemoryAccountModel } from '@/infra/db/memory/models/auth'
import faker from 'faker'

export class MemoryAccountRepository implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, ListAccountRepository {
  private readonly accounts: MemoryAccountModel[]

  constructor () {
    this.accounts = []
  }

  async create ({ name, email, password }: CreateAccountModel): Promise<MemoryAccountModel> {
    const account: MemoryAccountModel = {
      id: faker.random.uuid(),
      name,
      email,
      password,
      email_valided: false,
      created_at: new Date(),
      updated_at: new Date()
    }
    this.accounts.push(account)
    return account
  }

  async getAccountByEmail (email: string): Promise<MemoryAccountModel> {
    return this.accounts.find(account => account.email === email)
  }

  async getAccountById (accountId: string): Promise<MemoryAccountModel> {
    return this.accounts.find(account => account.id === accountId)
  }

  async update (update: UpdateAccountModel): Promise<MemoryAccountModel> {
    const index = this.accounts.findIndex(account => account.id === update.id)
    if (index >= 0) {
      this.accounts[index] = {
        ...this.accounts[index],
        ...update,
        updated_at: new Date()
      }
      return this.accounts[index]
    }
    return null
  }

  async list (filter: ListAccountRepositoryFilter): Promise<MemoryAccountModel[]> {
    return this.accounts.filter(account => ((!filter.name) || (account.name === filter.name)) && ((!filter.email) || (account.email === filter.email)))
  }
}
