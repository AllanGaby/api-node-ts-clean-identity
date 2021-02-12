import { FileModel } from '@/domain/models/files'
import { UploadFileUseCase, UploadFileDTO } from '@/domain/usecases/files'
import path from 'path'
import faker from 'faker'

export const mockFileModel = (): FileModel => ({
  id: faker.random.uuid(),
  path: `${faker.system.directoryPath()}${path.sep}${faker.system.filePath()}`,
  created_at: new Date()
})

export const mockUploadFileDTO = (): UploadFileDTO => ({
  filePath: `${faker.system.directoryPath()}${path.sep}${faker.system.filePath()}`
})

export class UploadFileUseCaseSpy implements UploadFileUseCase {
  params: UploadFileDTO
  file: FileModel = mockFileModel()

  async upload (params: UploadFileDTO): Promise<FileModel> {
    this.params = params
    return this.file
  }
}
