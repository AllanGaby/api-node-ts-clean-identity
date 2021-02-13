import { UploadStorageFile } from '@/data/protocols/storage'
import { CreateFileRepository } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import { UploadFileUseCase, UploadFileDTO } from '@/domain/usecases/files'
import path from 'path'

export class DbUploadFileUseCase implements UploadFileUseCase {
  constructor (
    private readonly createFileRepository: CreateFileRepository,
    private readonly uploadFile: UploadStorageFile
  ) {}

  async upload ({ filePath }: UploadFileDTO): Promise<FileModel> {
    const extension = path.extname(filePath)
    const file = await this.createFileRepository.create({
      filePath
    })
    await this.uploadFile.upload({
      sourceFile: filePath,
      destinationFile: `${file.id}.${extension}`
    })
    return file
  }
}
