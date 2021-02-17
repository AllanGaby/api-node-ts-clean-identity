import { AccountNotFoundError } from '@/data/errors'
import { GetAccountByIdRepository } from '@/data/repositories/auth'
import { ShowFileRepository } from '@/data/repositories/files'
import { ShowAvatarAccountUseCase, ShowAvatarAccountDTO } from '@/domain/usecases/auth/account'

export class DbShowAvatarAccountUseCase implements ShowAvatarAccountUseCase {
  constructor (
    private readonly getAccountByIdRepository: GetAccountByIdRepository,
    private readonly showFileRepository: ShowFileRepository,
    private readonly defaultAvatarPath: string
  ) {}

  async show ({ accountId }: ShowAvatarAccountDTO): Promise<string> {
    const accountbyId = await this.getAccountByIdRepository.getAccountById(accountId)
    if (!accountbyId) {
      throw new AccountNotFoundError()
    }
    if (accountbyId.avatar_file_id) {
      const file = await this.showFileRepository.show(accountbyId.avatar_file_id)
      if (file) {
        return `${file.dir}/${file.id}${file.extention}`
      }
    }
    return this.defaultAvatarPath
  }
}
