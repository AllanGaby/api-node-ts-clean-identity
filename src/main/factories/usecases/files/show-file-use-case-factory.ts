import { ShowFileUseCase } from '@/domain/usecases/files'
import { DbShowFileUseCase } from '@/data/usecases/files'
import { RepositoryFactory } from '@/infra/db'
import { EnvConfig } from '@/main/config/env'

export const makeShowFileUseCase = (uploadDir: string): ShowFileUseCase => {
  return new DbShowFileUseCase(RepositoryFactory.getFileRepository(EnvConfig.repositoryType))
}
