import { makeUpdateAccountValidation } from '@/main/factories/validations/auth'
import { makeDbUpdateAccount } from '@/main/factories/usecases/auth/memory/account'
import { UpdateAccountController } from '@/presentation/controllers/auth/account'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeUpdateAccountController = (): UpdateAccountController => {
  return new UpdateAccountController(
    makeUpdateAccountValidation({
      minLengthName: 5,
      minLengthPassword: 6,
      emailValidator: new EmailValidatorAdapter()
    }),
    makeDbUpdateAccount())
}