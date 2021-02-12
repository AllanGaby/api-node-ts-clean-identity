import { CreateFileRepository, CreateFileModel } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'

export class CreateFileRepositorySpy implements CreateFileRepository {
  params: CreateFileModel
  file: FileModel

  async create(params: CreateFileModel): Promise<FileModel> {
    this.params = params
    return this.file
  }
}
