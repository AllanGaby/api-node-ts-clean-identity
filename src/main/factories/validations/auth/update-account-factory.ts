import { ValidationComposite, ValidationBuilder } from '@/validation/validations'
import { EmailValidator } from '@/validation/protocols'

export interface UpdateAccountValidationConfig {
  minLengthName: number
  minLengthPassword: number
  emailValidator: EmailValidator
}

export const makeUpdateAccountValidation = ({ minLengthName, minLengthPassword, emailValidator }: UpdateAccountValidationConfig): ValidationComposite => {
  const idValidation = ValidationBuilder.field('account.id').required()
  const nameValidation = ValidationBuilder.field('name').min(minLengthName)
  const emailValidation = ValidationBuilder.field('email').email(emailValidator)
  const passwordValidation = ValidationBuilder.field('password').min(minLengthPassword)
  const passwordConfirmationValidation = ValidationBuilder.field('password_confirmation').min(minLengthPassword).sameAs('password')

  return new ValidationComposite([
    ...idValidation.build(),
    ...nameValidation.build(),
    ...emailValidation.build(),
    ...passwordValidation.build(),
    ...passwordConfirmationValidation.build()
  ])
}
