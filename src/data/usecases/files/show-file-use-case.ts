import { ShowFileUseCase } from '@/domain/usecases/files'
import { FileModel } from '@/domain/models/files'
import { ShowFileRepository } from '@/data/repositories/files'

export class DbShowFileUseCase implements ShowFileUseCase {
  constructor (private readonly showFileRepository: ShowFileRepository) {}

  async show (fileId: string): Promise<FileModel> {
    return await this.showFileRepository.show(fileId)
  }
}
