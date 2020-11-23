import { ValidationComposite, ValidationBuilder } from '@/validation/validations'
import { EmailValidator } from '@/validation/protocols'

export const makeAuthenticationAccountValidation = (emailValidator: EmailValidator): ValidationComposite => {
  const emailValidation = ValidationBuilder.field('email').required().email(emailValidator)
  const passwordValidation = ValidationBuilder.field('password').required()
  return new ValidationComposite([
    ...emailValidation.build(),
    ...passwordValidation.build()
  ])
}
