import { Account } from '@/infra/db/typeorm/models'
import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, UpdateAccountDTO } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'

export class AccountRepositoryTypeORM implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository {
  private readonly accountRepositoryTypeOrm: Repository<Account>
  private static instance: AccountRepositoryTypeORM

  private constructor () {
    this.accountRepositoryTypeOrm = getRepository<Account>(Account)
  }

  public static getInstance (): AccountRepositoryTypeORM {
    if (!AccountRepositoryTypeORM.instance) {
      AccountRepositoryTypeORM.instance = new AccountRepositoryTypeORM()
    }
    return AccountRepositoryTypeORM.instance
  }

  async create (data: CreateAccountModel): Promise<Account> {
    const createdAccount = this.accountRepositoryTypeOrm.create({
      ...data,
      email_valided: false,
      avatar_extention: null
    })
    await this.accountRepositoryTypeOrm.save(createdAccount)
    return createdAccount
  }

  async getAccountByEmail (email: string): Promise<Account> {
    return await this.accountRepositoryTypeOrm.findOne({
      where: {
        email
      }
    })
  }

  async getAccountById (id: string): Promise<Account> {
    return await this.accountRepositoryTypeOrm.findOne({
      where: {
        id
      }
    })
  }

  async update (data: UpdateAccountDTO): Promise<Account> {
    const account = await this.accountRepositoryTypeOrm.findOne(data.id)
    if (!account) {
      return undefined
    }
    const updatedAccount = {
      ...account,
      ...data
    }
    await this.accountRepositoryTypeOrm.save(updatedAccount)
    return updatedAccount
  }
}
