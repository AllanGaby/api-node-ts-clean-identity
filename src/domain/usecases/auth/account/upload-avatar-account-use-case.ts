import { AccountModel } from '@/domain/models/auth'

export interface UploadAvatarAccountDTO {
  accountId: string
  avatarFilePath: string
}

export interface UploadAvatarAccountUseCase {
  upload: (avatar: UploadAvatarAccountDTO) => Promise<AccountModel>
}
