import { CreateFileRepository, CreateFileModel } from '@/data/repositories/files'
import { FileModel } from '@/domain/models/files'
import { mockFileModel } from './mock-file'
import path from 'path'
import faker from 'faker'

export class CreateFileRepositorySpy implements CreateFileRepository {
  params: CreateFileModel
  file: FileModel = mockFileModel()

  async create (params: CreateFileModel): Promise<FileModel> {
    this.params = params
    return this.file
  }
}

export const mockCreateFileModel = (): CreateFileModel => ({
  filePath: `${faker.system.directoryPath()}${path.sep}${faker.system.filePath()}`
})
