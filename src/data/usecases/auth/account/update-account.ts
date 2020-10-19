import { GetAccountByIdRepository } from '@/data/repositories/auth/account'
import { UpdateAccountDTO } from '@/domain/dtos/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { UpdateAccount } from '@/domain/usecases/auth/account'

export class DbUpdateAccount implements UpdateAccount {
  constructor (private readonly getAccountByIdRepository: GetAccountByIdRepository) {}

  async update (account: UpdateAccountDTO): Promise<AccountModel> {
    await this.getAccountByIdRepository.getAccountById(account.id)
    return null
  }
}
