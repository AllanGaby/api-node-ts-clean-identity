import { FileModel } from '@/domain/models/files'

export interface ShowAvatarAccountDTO {
  fileId: string
}

export interface ShowAvatarAccountUseCase {
  show: (data: ShowAvatarAccountDTO) => Promise<FileModel>
}
