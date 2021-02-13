import { ShowAvatarAccountController } from '@/presentation/controllers/auth/account'
import { makeShowAvatarAccountValidation } from '@/main/factories/validations/auth'
import { makeShowAvatarAccountUseCase } from '@/main/factories/usecases/auth/account'

export const makeShowAvatarAccountController = (): ShowAvatarAccountController => {
  return new ShowAvatarAccountController(
    makeShowAvatarAccountValidation(),
    makeShowAvatarAccountUseCase())
}
