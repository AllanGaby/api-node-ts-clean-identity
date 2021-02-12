import { FileModel } from '@/domain/models/files'

export interface CreateFileModel {
  filePath: string
  extension: string
}

export interface CreateFileRepository {
  create(createFileModel: CreateFileModel): Promise<FileModel>
}