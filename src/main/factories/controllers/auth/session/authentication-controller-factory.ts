import { AuthenticationAccountController } from '@/presentation/controllers/auth/account'
import { makeAuthenticationAccountValidation } from '@/main/factories/validations/auth'
import { makeDbAuthenticationAccount } from '@/main/factories/usecases/auth/memory/account'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeAuthenticationAccountController = (): AuthenticationAccountController => {
  return new AuthenticationAccountController(
    makeAuthenticationAccountValidation(new EmailValidatorAdapter()),
    makeDbAuthenticationAccount())
}
