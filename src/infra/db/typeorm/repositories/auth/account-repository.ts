import { Account } from '@/infra/db/typeorm/models'
import { CreateAccountRepository, CreateAccountModel } from '@/data/repositories/auth'
import { getRepository, Repository } from 'typeorm'
import { AccountType } from '@/domain/models/auth'

export class AccountRepositoryTypeORM implements CreateAccountRepository {
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
}
