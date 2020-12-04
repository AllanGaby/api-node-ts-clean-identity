import { RequestRecoverPasswordController } from '@/presentation/controllers/auth/account'
import { makeRequestRecoverPasswordValidation } from '@/main/factories/validations/auth'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { makeDbRequestRecoverPassword } from '@/main/factories/usecases/auth/memory/account'

export const makeRequestRecoverPasswordController = (): RequestRecoverPasswordController => {
  const emailValidator = new EmailValidatorAdapter()
  return new RequestRecoverPasswordController(
    makeRequestRecoverPasswordValidation(emailValidator),
    makeDbRequestRecoverPassword()
  )
}
