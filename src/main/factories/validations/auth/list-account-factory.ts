import { ValidationComposite, ValidationBuilder } from '@/validation/validations'
import { EmailValidator } from '@/validation/protocols'

export interface ListAccountValidationConfig {
  emailValidator: EmailValidator
}

export const makeListAccountValidation = ({ emailValidator }: ListAccountValidationConfig): ValidationComposite => {
  return new ValidationComposite([
    ...ValidationBuilder.field('name').min(1).build(),
    ...ValidationBuilder.field('email').email(emailValidator).build()
  ])
}
