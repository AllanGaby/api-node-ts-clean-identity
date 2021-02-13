import { makeRecoverPassowrdValidation } from './recover-password-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import faker from 'faker'

jest.mock('@/validation/validations/validation-composite')

describe('makeRecoverPassowrdValidation ', () => {
  test('Should call ValidationComposite with all validations', () => {
    const minLengthPassword = faker.random.number({ min: 1, max: 20 })
    makeRecoverPassowrdValidation(minLengthPassword)
    const validations: Validation[] = [
      ...ValidationBuilder.field('session_id').required().build(),
      ...ValidationBuilder.field('password').required().min(minLengthPassword).build(),
      ...ValidationBuilder.field('password_confirmation').required().min(minLengthPassword).sameAs('password').build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
