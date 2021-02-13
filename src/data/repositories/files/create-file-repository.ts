import { FileModel } from '@/domain/models/files'

export interface CreateFileModel {
  dir: string
  extention: string
}

export interface CreateFileRepository {
  create: (createFileModel: CreateFileModel) => Promise<FileModel>
}
