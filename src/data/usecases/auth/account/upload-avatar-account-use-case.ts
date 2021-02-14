import { AccountModel } from '@/domain/models/auth'
import { DeleteFileUseCase, UploadFileUseCase } from '@/domain/usecases/files'
import { UploadAvatarAccountUseCase, UploadAvatarAccountDTO } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository, UpdateAccountRepository } from '@/data/repositories/auth'
import { AccountNotFoundError } from '@/data/errors'
import { CacheRemove } from '@/data/protocols/cache'

export class DbUploadAvatarAccountUseCase implements UploadAvatarAccountUseCase {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly cacheRemove: CacheRemove
  ) {}

  async upload ({ accountId, avatarFilePath }: UploadAvatarAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(accountId)
    if (!accountById) {
      throw new AccountNotFoundError()
    }
    if (accountById.avatar_file_id) {
      await this.deleteFileUseCase.delete(accountById.avatar_file_id)
    }
    const file = await this.uploadFileUseCase.upload({
      filePath: avatarFilePath
    })
    const updatedAccount = await this.updateAccountRepository.update({
      ...accountById,
      avatar_file_id: file.id
    })
    await this.cacheRemove.remove(`account:${updatedAccount.email}`)
    return updatedAccount
  }
}
