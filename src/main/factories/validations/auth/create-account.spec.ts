import { makeCreateAccountValidation, CreateAccountValidationConfig } from './create-account'
import { ValidationBuilder, ValidationComposite } from '@/validation/validations'
import { EmailValidator, Validation } from '@/validation/protocols'
import { EmailValidatorSpy } from '@/validation/test'
import faker from 'faker'

jest.mock('@/validation/validations/validation-composite')

const makeNameValidations = (minLength: number = 5): Validation[] => {
  return ValidationBuilder.field('name').required().min(minLength).build()
}

const makeEmailValidations = (emailValidator: EmailValidator): Validation[] => {
  return ValidationBuilder.field('email').required().email(emailValidator).build()
}

const makePasswordValidations = (minLength: number = 5): Validation[] => {
  return ValidationBuilder.field('password').required().min(minLength).build()
}

const makePasswordConfirmationValidations = (minLength: number = 5): Validation[] => {
  return ValidationBuilder.field('password_confirmation').required().min(minLength).sameAs('password').build()
}

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
      ...makeNameValidations(config.minLengthName),
      ...makeEmailValidations(config.emailValidator),
      ...makePasswordValidations(config.minLengthPassword),
      ...makePasswordConfirmationValidations(config.minLengthPassword)
    ]
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
