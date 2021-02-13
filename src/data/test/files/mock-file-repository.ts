import { CreateFileRepository, CreateFileModel, ShowFileRepository, DeleteFileRepository } from '@/data/repositories/files'
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

export class ShowFileRepositorySpy implements ShowFileRepository {
  fileId: string
  file: FileModel = mockFileModel()

  async show (fileId: string): Promise<FileModel> {
    this.fileId = fileId
    return this.file
  }
}

export class DeleteFileRepositoryStub implements DeleteFileRepository {
  fileId: string

  async delete (fileId: string): Promise<void> {
    this.fileId = fileId
  }
}
