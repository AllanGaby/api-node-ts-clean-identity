import { DeleteFileUseCase } from '@/domain/usecases/files'
import { DbDeleteFileUseCase } from '@/data/usecases/files'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/environment'
import { LocalStorage } from '@/infra/storage'

export const makeDeleteFileUseCase = (uploadDir: string): DeleteFileUseCase => {
  const fileRepository = RepositoryFactory.getFileRepository(EnvConfig.repositoryType)
  const localStorage = new LocalStorage({
    temporaryDir: 'temp',
    uploadDir
  })
  return new DbDeleteFileUseCase(fileRepository, localStorage, fileRepository)
}
