import { FileModel } from '@/domain/models/files'

export interface ShowFileRepository {
  show: (fileId: string) => Promise<FileModel>
}
