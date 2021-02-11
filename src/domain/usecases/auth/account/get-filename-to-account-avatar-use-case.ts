import { AvatarModel } from '@/domain/models/auth'

export interface GetFilenameToAccountAvatarDTO {
  accountId: string
  uploadDir: string
}

export interface GetFilenameToAccountAvatar {
  getPath: (filter: GetFilenameToAccountAvatarDTO) => Promise<AvatarModel>
}
