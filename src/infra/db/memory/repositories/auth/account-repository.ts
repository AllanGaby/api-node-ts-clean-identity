import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, UpdateAccountDTO } from '@/data/repositories/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { EnvConfig } from '@/main/config/environment'
import faker from 'faker'

export class MemoryAccountRepository implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository {
  private readonly accounts: AccountModel[]
  private static instance: MemoryAccountRepository

  private includeAccount ({ name, email, password }: CreateAccountModel): AccountModel {
    const account: AccountModel = {
      id: faker.random.uuid(),
      name,
      email,
      password,
      email_valided: false,
      avatar_file_id: undefined,
      created_at: new Date(),
      updated_at: new Date()
    }
    this.accounts.push(account)
    return account
  }

  private constructor () {
    this.accounts = []
    this.includeAccount({
      name: EnvConfig.default.name,
      email: EnvConfig.default.email,
      password: EnvConfig.default.password
    })
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
}
