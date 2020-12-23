import { Account } from '@/infra/db/typeorm/models'
import { CreateAccountRepository, CreateAccountModel, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, UpdateAccountDTO, ListAccountRepository, ListAccountRepositoryDTO } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'
import { AccountType } from '@/domain/models/auth'

export class AccountRepositoryTypeORM implements CreateAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository, UpdateAccountRepository, ListAccountRepository {
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

  async list (filter: ListAccountRepositoryDTO): Promise<Account[]> {
    return []
  }
}
