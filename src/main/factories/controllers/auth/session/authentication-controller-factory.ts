import { AuthenticationAccountController } from '@/presentation/controllers/auth/session'
import { makeAuthenticationAccountValidation } from '@/main/factories/validations/auth'
import { makeAuthenticationAccountUseCase } from '@/main/factories/usecases/auth/session'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeAuthenticationAccountController = (): AuthenticationAccountController => {
  return new AuthenticationAccountController(
    makeAuthenticationAccountValidation(new EmailValidatorAdapter()),
    makeAuthenticationAccountUseCase())
}
