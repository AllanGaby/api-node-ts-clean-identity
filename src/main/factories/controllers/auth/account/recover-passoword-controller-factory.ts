import { RecoverPasswordController } from '@/presentation/controllers/auth/account'
import { makeDbRecoverPassword } from '@/main/factories/usecases/auth/memory/account'
import { makeRecoverPassowrdValidation } from '@/main/factories/validations/auth'

export const makeRecoverPasswordController = (): RecoverPasswordController => {
  return new RecoverPasswordController(
    makeRecoverPassowrdValidation(6),
    makeDbRecoverPassword()
  )
}
