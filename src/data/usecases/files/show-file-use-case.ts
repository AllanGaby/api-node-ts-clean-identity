import { ShowFileUseCase } from '@/domain/usecases/files'
import { FileModel } from '@/domain/models/files'
import { ShowFileRepository } from '@/data/repositories/files'

export class DbShowFileUseCase implements ShowFileUseCase {
  constructor (private readonly showFileRepository: ShowFileRepository) {}

  async show (fileId: string): Promise<FileModel> {
    this.showFileRepository.show(fileId)
    return undefined
  }
}
