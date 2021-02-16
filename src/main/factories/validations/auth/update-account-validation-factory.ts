import { ValidationComposite, ValidationBuilder } from '@/validation/validations'
import { EmailValidator } from '@/validation/protocols'

export interface UpdateAccountValidationConfig {
  minLengthName: number
  minLengthPassword: number
  emailValidator: EmailValidator
}

export const makeUpdateAccountValidation = ({ minLengthName, minLengthPassword, emailValidator }: UpdateAccountValidationConfig): ValidationComposite => {
  const nameValidation = ValidationBuilder.field('name').min(minLengthName)
  const emailValidation = ValidationBuilder.field('email').email(emailValidator)
  const passwordValidation = ValidationBuilder.field('password').min(minLengthPassword)
  const newPasswordValidation = ValidationBuilder.field('new_password').min(minLengthPassword)
  const passwordConfirmationValidation = ValidationBuilder.field('password_confirmation').min(minLengthPassword).sameAs('new_password')

  return new ValidationComposite([
    ...nameValidation.build(),
    ...emailValidation.build(),
    ...passwordValidation.build(),
    ...newPasswordValidation.build(),
    ...passwordConfirmationValidation.build()
  ])
}
