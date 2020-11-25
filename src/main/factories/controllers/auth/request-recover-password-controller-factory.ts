import { RequestRecoverPasswordController } from '@/presentation/controllers/auth/account'
import { makeRequestRecoverPasswordValidation } from '../../validations/auth'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { makeDbRequestRecoverPassword } from '../../usecases/auth/memory/account'

export const makeRequestRecoverPasswordController = (): RequestRecoverPasswordController => {
  const emailValidator = new EmailValidatorAdapter()
  return new RequestRecoverPasswordController(
    makeRequestRecoverPasswordValidation(emailValidator),
    makeDbRequestRecoverPassword()
  )
}
