import { ShowAvatarAccountBySessionController } from '@/presentation/controllers/auth/account'
import { makeDbGetFilenameToAccountAvatar } from '@/main/factories/usecases/auth/memory/account'
import uploadConfig from '@/main/config/multer/config'

export const makeShowAvatarAccountBySessionController = (): ShowAvatarAccountBySessionController => {
  return new ShowAvatarAccountBySessionController(makeDbGetFilenameToAccountAvatar(), uploadConfig.uploadDirectory)
}
