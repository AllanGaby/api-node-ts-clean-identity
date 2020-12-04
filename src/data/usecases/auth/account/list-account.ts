import { ListAccount, ListAccountDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { ListAccountRepository } from '@/data/repositories/auth/account'

export class DbListAccount implements ListAccount {
  constructor (private readonly listAccountRepository: ListAccountRepository) {}

  async list (filter: ListAccountDTO): Promise<AccountModel[]> {
    return await this.listAccountRepository.list(filter)
  }
}
