import { SetAccessProfile, SetAccessProfileDTO } from '@/domain/usecases/auth/account'
import { AccountModel } from '@/domain/models/auth'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth/account'

export class DbSetAccessProfile implements SetAccessProfile {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) {}

  async setAccessProfile ({ accountId, accessProfileId }: SetAccessProfileDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(accountId)
    if (accountById) {
      await this.updateAccountRepository.update({
        id: accountById.id,
        email: accountById.email,
        name: accountById.name,
        email_valided: accountById.email_valided,
        password: accountById.password,
        accessProfileId
      })
    }
    return null
  }
}
