import { ShowAvatarAccountBySessionController } from '@/presentation/controllers/auth/account'
import { makeGetFilenameToAccountAvatarUseCase } from '@/main/factories/usecases/auth/account'
import uploadConfig from '@/main/config/multer/config'

export const makeShowAvatarAccountBySessionController = (): ShowAvatarAccountBySessionController => {
  return new ShowAvatarAccountBySessionController(makeGetFilenameToAccountAvatarUseCase(), uploadConfig.uploadDirectory)
}
