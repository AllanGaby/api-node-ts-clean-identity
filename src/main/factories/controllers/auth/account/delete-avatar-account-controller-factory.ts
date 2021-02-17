import { makeDeleteAvatarAccountUseCase } from '@/main/factories/usecases/auth/account'
import { DeleteAvatarAccountController } from '@/presentation/controllers/auth/account'

export const makeDeleteAvatarAccountController = (): DeleteAvatarAccountController => {
  return new DeleteAvatarAccountController(makeDeleteAvatarAccountUseCase())
}
