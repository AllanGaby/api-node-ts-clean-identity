import { FileNotFoundError } from '@/data/errors'
import { DeleteStorageFile } from '@/data/protocols/storage'
import { DeleteFileRepository, ShowFileRepository } from '@/data/repositories/files'
import { DeleteFileUseCase } from '@/domain/usecases/files'

export class DbDeleteFileUseCase implements DeleteFileUseCase {
  constructor (
    private readonly showFileRepository: ShowFileRepository,
    private readonly deleteStorageFile: DeleteStorageFile,
    private readonly deleteFileRepository: DeleteFileRepository
  ) {}

  async delete (fileId: string): Promise<void> {
    const file = await this.showFileRepository.show(fileId)
    if (!file) {
      throw new FileNotFoundError()
    }
    await this.deleteStorageFile.delete({ filePath: file.path })
    return undefined
  }
}
