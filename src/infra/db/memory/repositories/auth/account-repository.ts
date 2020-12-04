import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, UpdateAccountDTO, ListAccountRepository, ListAccountRepositoryDTO } from '@/data/repositories/auth/account'
import { AccountModel, AccountType } from '@/domain/models/auth'
import faker from 'faker'

export class MemoryAccountRepository implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, ListAccountRepository {
  private readonly accounts: AccountModel[]
  private static instance: MemoryAccountRepository

  private includeAccount ({ name, email, password }: CreateAccountModel): AccountModel {
    const account: AccountModel = {
      id: faker.random.uuid(),
      name,
      email,
      password,
      email_valided: false,
      type: AccountType.student,
      created_at: new Date(),
      updated_at: new Date()
    }
    this.accounts.push(account)
    return account
  }

  private constructor () {
    this.accounts = []
    this.includeAccount({
      name: 'Developer',
      email: 'developer@identity.com',
      password: '$2b$12$ICG0NwCRaVL.r12lhzV.ROT38fLbJ5kvg.AOJ5wxtxKvWDEhnKKE6'
    })
    this.accounts[0].type = AccountType.manager
    this.accounts[0].email_valided = true
  }

  public static getInstance (): MemoryAccountRepository {
    if (!MemoryAccountRepository.instance) {
      MemoryAccountRepository.instance = new MemoryAccountRepository()
    }
    return MemoryAccountRepository.instance
  }

  async create ({ name, email, password }: CreateAccountModel): Promise<AccountModel> {
    return this.includeAccount({ name, email, password })
  }

  async getAccountByEmail (email: string): Promise<AccountModel> {
    return this.accounts.find(account => account.email === email)
  }

  async getAccountById (accountId: string): Promise<AccountModel> {
    return this.accounts.find(account => account.id === accountId)
  }

  async update (update: UpdateAccountDTO): Promise<AccountModel> {
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

  async list (filter: ListAccountRepositoryDTO): Promise<AccountModel[]> {
    return this.accounts.filter(account => ((!filter.name) || (account.name === filter.name)) && ((!filter.email) || (account.email === filter.email)))
  }
}
