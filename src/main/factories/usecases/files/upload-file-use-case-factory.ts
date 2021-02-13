import { UploadFileUseCase } from '@/domain/usecases/files'
import { DbUploadFileUseCase } from '@/data/usecases/files'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'
import { LocalStorage } from '@/infra/storage'

export const makeUploadFileUseCase = (uploadDir: string): UploadFileUseCase => {
  const localStorage = new LocalStorage({
    temporaryDir: 'temp',
    uploadDir
  })
  return new DbUploadFileUseCase(RepositoryFactory.getFileRepository(EnvConfig.repositoryType), uploadDir, localStorage)
}
