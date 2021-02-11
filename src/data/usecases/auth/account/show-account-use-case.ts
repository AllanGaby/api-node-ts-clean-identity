import { ShowAccount, ShowAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'

export class DbShowAccount implements ShowAccount {
  constructor (private readonly getAccountByIdRepository: GetAccountByIdRepository) {}

  async show ({ accountId }: ShowAccountDTO): Promise<AccountModel> {
    return await this.getAccountByIdRepository.getAccountById(accountId)
  }
}
