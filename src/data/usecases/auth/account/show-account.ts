import { ShowAccount, ShowAccountFilter } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { ShowAccountRepository } from '@/data/repositories/auth/account'

export class DbShowAccount implements ShowAccount {
  constructor (private readonly showAccountRepository: ShowAccountRepository) {}

  async show (filter: ShowAccountFilter): Promise<AccountModel> {
    return await this.showAccountRepository.show(filter)
  }
}
