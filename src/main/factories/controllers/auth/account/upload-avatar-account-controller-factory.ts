import { makeUploadAvatarAccountValidation } from '@/main/factories/validations/auth'
import { makeUploadAvatarAccountUseCase } from '@/main/factories/usecases/auth/account'
import { UploadAvatarAccountController } from '@/presentation/controllers/auth/account'

export const makeUploadAvatarAccountController = (): UploadAvatarAccountController => {
  return new UploadAvatarAccountController(
    makeUploadAvatarAccountValidation(),
    makeUploadAvatarAccountUseCase())
}
