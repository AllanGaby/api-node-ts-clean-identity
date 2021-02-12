import { FileModel } from '@/domain/models/files'

export interface UploadFileDTO {
  filePath: string
}

export interface UploadFileUseCase {
  upload: (data: UploadFileDTO) => Promise<FileModel>
}
