import { ShowFileRepository } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import { ShowAvatarAccountUseCase, ShowAvatarAccountDTO } from '@/domain/usecases/auth/account'

export class DbShowAvatarAccountUseCase implements ShowAvatarAccountUseCase {
  constructor (
    private readonly showFileRepository: ShowFileRepository
  ) {}

  async show ({ fileId }: ShowAvatarAccountDTO): Promise<FileModel> {
    return await this.showFileRepository.show(fileId)
  }
}
