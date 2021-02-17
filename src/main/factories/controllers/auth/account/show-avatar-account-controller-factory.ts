import { ShowAvatarAccountController } from '@/presentation/controllers/auth/account'
import { makeShowAvatarAccountUseCase } from '@/main/factories/usecases/auth/account'

export const makeShowAvatarAccountController = (): ShowAvatarAccountController => {
  return new ShowAvatarAccountController(
    makeShowAvatarAccountUseCase())
}
