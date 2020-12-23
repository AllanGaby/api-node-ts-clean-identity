import { Account } from '@/infra/db/typeorm/models'
import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'
import { AccountType } from '@/domain/models/auth'

export class AccountRepositoryTypeORM implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository {
  private readonly accountRepositoryTypeOrm: Repository<Account>

  constructor () {
    this.accountRepositoryTypeOrm = getRepository<Account>(Account)
  }

  async create (data: CreateAccountModel): Promise<Account> {
    const createdAccount = this.accountRepositoryTypeOrm.create({
      ...data,
      type: AccountType.student,
      email_valided: false
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
}
