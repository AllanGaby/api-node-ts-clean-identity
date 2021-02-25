import { makeAuthenticationAccountValidation } from './authentication-account-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/tests'

jest.mock('@/validation/validations/validation-composite')

describe('makeAuthenticationAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    const emailValidator = new EmailValidatorSpy()
    makeAuthenticationAccountValidation(emailValidator)
    const validations: Validation[] = [
      ...ValidationBuilder.field('email').required().email(emailValidator).build(),
      ...ValidationBuilder.field('password').required().build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
