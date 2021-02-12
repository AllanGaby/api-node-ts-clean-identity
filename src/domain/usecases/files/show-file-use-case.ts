import { FileModel } from '@/domain/models/files'

export interface ShowFileUseCase {
  show: (fileId: string) => Promise<FileModel>
}
