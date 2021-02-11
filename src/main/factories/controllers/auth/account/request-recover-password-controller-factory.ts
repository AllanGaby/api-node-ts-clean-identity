import { RequestRecoverPasswordController } from '@/presentation/controllers/auth/account'
import { makeRequestRecoverPasswordValidation } from '@/main/factories/validations/auth'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { makeRequestRecoverPasswordUseCase } from '@/main/factories/usecases/auth/account'

export const makeRequestRecoverPasswordController = (): RequestRecoverPasswordController => {
  const emailValidator = new EmailValidatorAdapter()
  return new RequestRecoverPasswordController(
    makeRequestRecoverPasswordValidation(emailValidator),
    makeRequestRecoverPasswordUseCase()
  )
}
