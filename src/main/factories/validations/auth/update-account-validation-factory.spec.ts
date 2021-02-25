import { makeUpdateAccountValidation, UpdateAccountValidationConfig } from './update-account-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/tests'
import faker from 'faker'

jest.mock('@/validation/validations/validation-composite')

const makeUpdateAccountValidationConfig = (): UpdateAccountValidationConfig => ({
  emailValidator: new EmailValidatorSpy(),
  minLengthName: faker.random.number({ min: 1, max: 20 }),
  minLengthPassword: faker.random.number({ min: 1, max: 20 })
})

describe('makeUpdateAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    const config = makeUpdateAccountValidationConfig()
    makeUpdateAccountValidation(config)
    const validations: Validation[] = [
      ...ValidationBuilder.field('name').min(config.minLengthName).build(),
      ...ValidationBuilder.field('email').email(config.emailValidator).build(),
      ...ValidationBuilder.field('password').min(config.minLengthPassword).conditionalRequired('new_password').build(),
      ...ValidationBuilder.field('new_password').min(config.minLengthPassword).conditionalRequired('password').build(),
      ...ValidationBuilder.field('password_confirmation').min(config.minLengthPassword).sameAs('new_password').build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
