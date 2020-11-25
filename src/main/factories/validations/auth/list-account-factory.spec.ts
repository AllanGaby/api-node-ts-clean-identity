import { makeListAccountValidation } from './list-account-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/test'

jest.mock('@/validation/validations/validation-composite')

describe('makeListAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    const emailValidator = new EmailValidatorSpy()
    makeListAccountValidation({ emailValidator })
    const validations: Validation[] = [
      ...ValidationBuilder.field('name').min(1).build(),
      ...ValidationBuilder.field('email').email(emailValidator).build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
