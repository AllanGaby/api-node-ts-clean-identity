import { UploadStorageFile } from '@/data/protocols/storage'
import { CreateFileRepository } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import { UploadFileUseCase, UploadFileDTO } from '@/domain/usecases/files'
import path from 'path'

export class DbUploadFileUseCase implements UploadFileUseCase {
  constructor (
    private readonly createFileRepository: CreateFileRepository,
    private readonly uploadDir: string,
    private readonly uploadFile: UploadStorageFile
  ) {}

  async upload ({ filePath }: UploadFileDTO): Promise<FileModel> {
    const extention = path.extname(filePath)
    const file = await this.createFileRepository.create({
      dir: `${this.uploadDir}`,
      extention
    })
    await this.uploadFile.upload({
      sourceFile: filePath,
      destinationFile: `${this.uploadDir}${file.id}${extention}`
    })
    return file
  }
}
