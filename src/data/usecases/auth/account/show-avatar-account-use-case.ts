import { ShowFileRepository } from '@/data/repositories/files'
import { ShowAvatarAccountUseCase, ShowAvatarAccountDTO } from '@/domain/usecases/auth/account'

export class DbShowAvatarAccountUseCase implements ShowAvatarAccountUseCase {
  constructor (
    private readonly showFileRepository: ShowFileRepository,
    private readonly defaultAvatarPath: string
  ) {}

  async show ({ fileId }: ShowAvatarAccountDTO): Promise<string> {
    if (fileId) {
      const file = await this.showFileRepository.show(fileId)
      if (file) {
        return `${file.dir}/${file.id}${file.extention}`
      }
    }
    return this.defaultAvatarPath
  }
}
