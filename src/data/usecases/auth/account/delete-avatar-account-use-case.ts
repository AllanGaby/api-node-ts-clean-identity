import { AccountModel } from '@/domain/models/auth'
import { DeleteFileUseCase } from '@/domain/usecases/files'
import { DeleteAvatarAccountUseCase, DeleteAvatarAccountDTO } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth'
import { AccountNotFoundError } from '@/data/errors'
import { CacheRemove } from '@/data/protocols/cache'

export class DbDeleteAvatarAccountUseCase implements DeleteAvatarAccountUseCase {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly cacheRemove: CacheRemove
  ) {}

  async delete ({ accountId }: DeleteAvatarAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(accountId)
    if (!accountById) {
      throw new AccountNotFoundError()
    }
    if (accountById.avatar_file_id) {
      await this.deleteFileUseCase.delete(accountById.avatar_file_id)
    }
    const updatedAccount = await this.updateAccountRepository.update({
      ...accountById,
      avatar_file_id: undefined
    })
    await this.cacheRemove.remove(`account:${updatedAccount.email}`)
    return updatedAccount
  }
}
