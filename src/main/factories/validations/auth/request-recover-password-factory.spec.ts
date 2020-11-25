import { makeRequestRecoverPasswordValidation } from './request-recover-password-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/test'

jest.mock('@/validation/validations/validation-composite')

describe('makeRequestRecoverPasswordValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    const emailValidator = new EmailValidatorSpy()
    makeRequestRecoverPasswordValidation(emailValidator)
    const validations: Validation[] = [
      ...ValidationBuilder.field('email').required().email(emailValidator).build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
