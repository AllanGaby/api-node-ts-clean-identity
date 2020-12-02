import { ValidationComposite, ValidationBuilder } from '@/validation/validations'

export const makeShowAccountByIdValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...ValidationBuilder.field('account_id').required().build()
  ])
}
