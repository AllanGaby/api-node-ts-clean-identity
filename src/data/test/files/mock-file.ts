import { FileModel } from '@/domain/models/files'
import { UploadFileDTO } from '@/domain/usecases/files'
import path from 'path'
import faker from 'faker'

export const mockFileModel = (): FileModel => ({
  id: faker.random.uuid(),
  path: faker.system.filePath(),
  extention: faker.system.fileExt('png')
})

export const mockUploadFileDTO = (): UploadFileDTO => ({
  filePath: `${faker.system.directoryPath()}${path.sep}${faker.system.filePath()}`
})