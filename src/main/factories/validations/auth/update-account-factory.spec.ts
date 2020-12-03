import { makeUpdateAccountValidation, UpdateAccountValidationConfig } from './update-account-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/test'
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
      ...ValidationBuilder.field('account.id').required().build(),
      ...ValidationBuilder.field('name').min(config.minLengthName).build(),
      ...ValidationBuilder.field('email').email(config.emailValidator).build(),
      ...ValidationBuilder.field('password').min(config.minLengthPassword).build(),
      ...ValidationBuilder.field('password_confirmation').min(config.minLengthPassword).sameAs('password').build()
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
