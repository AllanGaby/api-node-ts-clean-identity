import { AvatarModel } from '@/domain/models/auth'

export interface GetAvatarFilter {
  accountId: string
  uploadDir: string
}

export interface GetFilenameToAccountAvatar {
  getPath: (filter: GetAvatarFilter) => Promise<AvatarModel>
}
