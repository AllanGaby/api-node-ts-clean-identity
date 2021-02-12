import { CreateFileRepository, CreateFileModel } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import { mockFileModel } from './mock-file'

export class CreateFileRepositorySpy implements CreateFileRepository {
  params: CreateFileModel
  file: FileModel = mockFileModel()

  async create (params: CreateFileModel): Promise<FileModel> {
    this.params = params
    return this.file
  }
}
