import { makeCreateAccountValidation, CreateAccountValidationConfig } from './create-account-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/tests'
import faker from 'faker'

jest.mock('@/validation/validations/validation-composite')

const makeCreateAccountValidationConfig = (): CreateAccountValidationConfig => ({
  emailValidator: new EmailValidatorSpy(),
  minLengthName: faker.random.number({ min: 1, max: 20 }),
  minLengthPassword: faker.random.number({ min: 1, max: 20 })
})

describe('makeCreateAccountValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    const config = makeCreateAccountValidationConfig()
    makeCreateAccountValidation(config)
    const validations: Validation[] = [
      ...ValidationBuilder.field('name').required().min(config.minLengthName).build(),
      ...ValidationBuilder.field('email').required().email(config.emailValidator).build(),
      ...ValidationBuilder.field('password').required().min(config.minLengthPassword).build(),
      ...ValidationBuilder.field('password_confirmation').required().min(config.minLengthPassword).sameAs('password').build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
