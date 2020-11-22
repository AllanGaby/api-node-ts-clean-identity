import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeActiveAccountValidation = (): ValidationComposite => {
  return new ValidationComposite(ValidationBuilder.field('session_id').required().build())
}
