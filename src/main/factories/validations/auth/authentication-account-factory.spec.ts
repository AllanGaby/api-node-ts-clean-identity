import { makeCreateAccountValidation } from './authentication-account-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/test'

jest.mock('@/validation/validations/validation-composite')

describe('makeCreateAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    const emailValidator = new EmailValidatorSpy()
    makeCreateAccountValidation(emailValidator)
    const validations: Validation[] = [
      ...ValidationBuilder.field('email').required().email(emailValidator).build(),
      ...ValidationBuilder.field('password').required().build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
