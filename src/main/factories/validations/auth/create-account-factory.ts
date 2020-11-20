import { ValidationComposite, ValidationBuilder } from '@/validation/validations'
import { EmailValidator } from '@/validation/protocols'

export interface CreateAccountValidationConfig {
  minLengthName: number
  minLengthPassword: number
  emailValidator: EmailValidator
}

export const makeCreateAccountValidation = ({ minLengthName, minLengthPassword, emailValidator }: CreateAccountValidationConfig): ValidationComposite => {
  const nameValidation = ValidationBuilder.field('name').required().min(minLengthName)
  const emailValidation = ValidationBuilder.field('email').required().email(emailValidator)
  const passwordValidation = ValidationBuilder.field('password').required().min(minLengthPassword)
  const passwordConfirmationValidation = ValidationBuilder.field('password_confirmation').required().min(minLengthPassword).sameAs('password')

  return new ValidationComposite([
    ...nameValidation.build(),
    ...emailValidation.build(),
    ...passwordValidation.build(),
    ...passwordConfirmationValidation.build()
  ])
}
