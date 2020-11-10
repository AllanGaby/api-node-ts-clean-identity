import { SetAccountType, SetAccountTypeDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'

export class DbSetAccountType implements SetAccountType {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) {}

  async setAccountType ({ accountId, accountType }: SetAccountTypeDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(accountId)
    if (accountById) {
      return await this.updateAccountRepository.update({
        id: accountById.id,
        email: accountById.email,
        name: accountById.name,
        email_valided: accountById.email_valided,
        password: accountById.password,
        type: accountType
      })
    }
    throw new Error('Account not found')
  }
}
