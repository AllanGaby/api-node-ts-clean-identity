import { RecoverPasswordController } from '@/presentation/controllers/auth/account'
import { makeRecoverPasswordUseCase } from '@/main/factories/usecases/auth/account'
import { makeRecoverPassowrdValidation } from '@/main/factories/validations/auth'

export const makeRecoverPasswordController = (): RecoverPasswordController => {
  return new RecoverPasswordController(
    makeRecoverPassowrdValidation(6),
    makeRecoverPasswordUseCase()
  )
}
