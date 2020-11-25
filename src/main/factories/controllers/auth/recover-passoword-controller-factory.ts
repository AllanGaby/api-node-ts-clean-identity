import { RecoverPasswordController } from '@/presentation/controllers/auth/account'
import { makeDbRecoverPassword } from '../../usecases/auth/memory/account'
import { makeRecoverPassowrdValidation } from '../../validations/auth'

export const makeRecoverPasswordController = (): RecoverPasswordController => {
  return new RecoverPasswordController(
    makeRecoverPassowrdValidation(6),
    makeDbRecoverPassword()
  )
}
