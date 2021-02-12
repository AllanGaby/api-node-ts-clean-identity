import { UploadFile } from '@/data/protocols/storage'
import { CreateFileRepository } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import { UploadFileUseCase, UploadFileDTO } from '@/domain/usecases/files'

export class DbUploadFileUseCase implements UploadFileUseCase {
  constructor (
    private readonly createFileRepository: CreateFileRepository,
    private readonly uploadFile: UploadFile
  ) {}

  async upload({ filePath }: UploadFileDTO): Promise<FileModel> {
    this.createFileRepository.create({
      filePath
    })
    return undefined
  }
}