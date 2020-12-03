import { GetFilenameToAccountAvatar, GetAvatarFilter } from '@/domain/usecases/auth/account'
import { GetAccountByIdRepository } from '@/data/repositories/auth/account'

export class DbGetFilenameToAccountAvatar implements GetFilenameToAccountAvatar {
  constructor (private readonly getAccountByIdRepository: GetAccountByIdRepository) {}

  async getPath ({ accountId }: GetAvatarFilter): Promise<string> {
    const account = await this.getAccountByIdRepository.getAccountById(accountId)
    if (account?.avatar_extention) {
      return `${account.id}.${account.avatar_extention}`
    }
    return null
  }
}
