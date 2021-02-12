import { AccountModel } from '@/domain/models/auth'
import { UploadFileUseCase } from '@/domain/usecases/files'
import { UploadAvatarAccountUseCase, UploadAvatarAccountDTO } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository } from '@/data/repositories/auth'

export class DbUploadAvatarAccountUseCase implements UploadAvatarAccountUseCase {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly uploadFileUseCase: UploadFileUseCase
  ) {}

  async upload ({ accountId, avatarFilePath }: UploadAvatarAccountDTO): Promise<AccountModel> {
    this.getAccountByIdRepository.getAccountById(accountId)
    return undefined
  }
}
