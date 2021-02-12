import { FileModel } from '@/domain/models/files'
import { UploadFileDTO } from '@/domain/usecases/files'
import faker from 'faker'

export const mockFileModel = (): FileModel => ({
  id: faker.random.uuid(),
  path: faker.system.filePath(),
  extention: faker.system.fileExt('png')
})

export const mockUploadFileDTO = (): UploadFileDTO => ({
  filePath: faker.image.imageUrl()
})