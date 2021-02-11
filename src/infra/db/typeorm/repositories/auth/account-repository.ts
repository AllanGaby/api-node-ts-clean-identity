import { Account } from '@/infra/db/typeorm/models'
import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, UpdateAccountDTO, ListAccountRepository, ListAccountRepositoryDTO } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'

export class AccountRepositoryTypeORM implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, ListAccountRepository {
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

  async list ({ name, email }: ListAccountRepositoryDTO): Promise<Account[]> {
    if ((name) && (email)) {
      return await this.accountRepositoryTypeOrm.find({
        where: {
          name,
          email
        }
      })
    } else if (name) {
      return await this.accountRepositoryTypeOrm.find({
        where: {
          name
        }
      })
    } else if (email) {
      return await this.accountRepositoryTypeOrm.find({
        where: {
          email
        }
      })
    }
    return []
  }
}
