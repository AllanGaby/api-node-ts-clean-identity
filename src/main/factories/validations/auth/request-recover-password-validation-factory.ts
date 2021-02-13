import { ValidationComposite, ValidationBuilder } from '@/validation/validations'
import { EmailValidator } from '@/validation/protocols'

export const makeRequestRecoverPasswordValidation = (emailValidator: EmailValidator): ValidationComposite => {
  return new ValidationComposite([
    ...ValidationBuilder.field('email').required().email(emailValidator).build()
  ])
}
