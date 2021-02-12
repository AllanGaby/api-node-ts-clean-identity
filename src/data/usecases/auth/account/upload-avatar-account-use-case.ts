import { AccountModel } from '@/domain/models/auth'
import { UploadFileUseCase } from '@/domain/usecases/files'
import { UploadAvatarAccountUseCase, UploadAvatarAccountDTO } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository } from '@/data/repositories/auth'
import { AccountNotFoundError } from '@/data/errors'

export class DbUploadAvatarAccountUseCase implements UploadAvatarAccountUseCase {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly uploadFileUseCase: UploadFileUseCase
  ) {}

  async upload ({ accountId, avatarFilePath }: UploadAvatarAccountDTO): Promise<AccountModel> {
    const accountById = await this.getAccountByIdRepository.getAccountById(accountId)
    if (!accountById) {
      throw new AccountNotFoundError()
    }
    await this.uploadFileUseCase.upload({
      filePath: avatarFilePath
    })
    return undefined
  }
}
