import { GetFilenameToAccountAvatarUseCase, GetFilenameToAccountAvatarDTO } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'
import { AvatarModel } from '@/domain/models/auth'
import path from 'path'

export class DbGetFilenameToAccountAvatarUseCase implements GetFilenameToAccountAvatarUseCase {
  constructor (private readonly getAccountByIdRepository: GetAccountByIdRepository) {}

  async getPath ({ accountId, uploadDir }: GetFilenameToAccountAvatarDTO): Promise<AvatarModel> {
    const account = await this.getAccountByIdRepository.getAccountById(accountId)
    if (account) {
      if (account.avatar_extention) {
        return {
          avatar_file_path: `${uploadDir}${path.sep}${account.id}${account.avatar_extention}`
        }
      } else {
        return {
          avatar_file_path: `${uploadDir}${path.sep}profile.png`
        }
      }
    }
    return null
  }
}
