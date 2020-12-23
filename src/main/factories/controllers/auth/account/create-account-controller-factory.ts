import { CreateAccountController } from '@/presentation/controllers/auth/account'
import { makeCreateAccountValidation } from '@/main/factories/validations/auth'
import { makeDbCreateAccount } from '@/main/factories/usecases/auth/account'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeCreateAccountController = (): CreateAccountController => {
  return new CreateAccountController(
    makeCreateAccountValidation({
      minLengthName: 5,
      minLengthPassword: 6,
      emailValidator: new EmailValidatorAdapter()
    }),
    makeDbCreateAccount())
}
